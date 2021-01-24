/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */


class Grille {
  tabCookiesCliquees = [];
  constructor(l, c) {
    this.l = l;
    this.c = c;
    let tabCookies;
    this.remplirTableauDeCookies(6);
  }


  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */

  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.l);
      let colonne = index % this.c;

      let img = this.tabCookies[ligne][colonne].htlmImage;

      img.onclick = (evt) => { //créer un écouteur sur le click

        let img = evt.target; //élément cliqué
        let l = img.dataset.ligne;
        let c = img.dataset.colonne;
        let type = this.getCookieDepuisLC(l, c);

        let cookieCliquee = this.tabCookies[ligne][colonne];

        //on selectionne d'abord le cookie
        this.tabCookiesCliquees.push(cookieCliquee);
        cookieCliquee.selectionnee();

        //on vérifie la distance entre 2 cookies selectionnées
        if (this.tabCookiesCliquees.length === 2) {
          let dist = Cookie.distance(this.tabCookiesCliquees[0], this.tabCookiesCliquees[1]);
          // si la distance est 1 swap et on les déselectionne
          if (dist === 1) {
            Cookie.swapCookies(this.tabCookiesCliquees[0], this.tabCookiesCliquees[1]);
          }
          // sinon on déselectionne les cookies simplement
          this.tabCookiesCliquees.forEach(cookieCourant => {
            cookieCourant.deselectionnee();
          });
          //on vide le tableau tabCookiesCliquees (=0)
          this.tabCookiesCliquees.splice(0);
        }




      }

      // ------- pour le drag n drop
      img.ondragstart = (evt) => {
        console.log("dragstart");
        let imgClickee = evt.target;
        let l = imgClickee.dataset.ligne;
        let c = imgClickee.dataset.colonne;
        let cookieDragguee = this.tabCookies[l][c];

        this.tabCookiesCliquees = [];
        this.tabCookiesCliquees.push(cookieDragguee);
        cookieDragguee.selectionnee();

        // on peut copier une valeur dans le "clipboard"
      };

      img.ondragover = (evt) => {
        return false;
      };

      img.ondragenter = (evt) => {
        console.log("ondragenter");
        let img = evt.target;
        // on ajoute la classe CSS grilleDragOver
        img.classList.add("grilleDragOver");
      };

      img.ondragleave = (evt) => {
        console.log("ondragleave");
        let img = evt.target;
        // on enlève la classe CSS grilleDragOver
        img.classList.remove("grilleDragOver");
      };

      img.ondrop = (evt) => {
        console.log("ondrop");
        let imgDrop = evt.target;
        let l = imgDrop.dataset.ligne;
        let c = imgDrop.dataset.colonne;
        let cookieSurZoneDeDrop = this.tabCookies[l][c];

        this.tabCookiesCliquees.push(cookieSurZoneDeDrop);

        if (Cookie.distance(this.tabCookiesCliquees[0],this.tabCookiesCliquees[1])===1) {
          console.log("swap");
          Cookie.swapCookies(this.tabCookiesCliquees[0],this.tabCookiesCliquees[1]);
        } else {
          console.log("SWAP PAS POSSIBLE");
        }
        this.tabCookiesCliquees[0].deselectionnee();
        this.tabCookiesCliquees[1].deselectionnee();
        imgDrop.classList.remove("grilleDragOver");

        this.tabCookiesCliquees = [];
      };
      div.append(img);
    });
  }

  

  getCookieDepuisLC(ligne, colonne) {
    return this.tabCookies[ligne][colonne].type;
  }

  



  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    this.tabCookies = create2DArray(9);
    for (let ligne = 0; ligne < this.l; ligne++) {
      for (let colonne = 0; colonne < this.c; colonne++) {
        let type = Math.floor(Math.random() * nbDeCookiesDifferents);
        let cookie = new Cookie(type, ligne, colonne);
        this.tabCookies[ligne][colonne] = cookie;
      }
    }
  }

  detecterAlignementSurLigne(ligne) {
    for (let cookie = 0; cookie < this.l - 2; cookie++) {
      if (this.tabCookies[ligne][cookie].type === this.tabCookies[ligne][cookie + 1].type && this.tabCookies[ligne][cookie].type === this.tabCookies[ligne][cookie + 2].type) {

        //on marque les 3 alignés
        this.tabCookies[ligne][cookie].flag = true;
        this.tabCookies[ligne][cookie + 1].flag = true;
        this.tabCookies[ligne][cookie + 2].flag = true;

        //on l'a fait disparaître
        this.tabCookies[ligne][cookie].cookieTrouvee();
        this.tabCookies[ligne][cookie + 1].cookieTrouvee();
        this.tabCookies[ligne][cookie + 2].cookieTrouvee();

      }
    }
  }

  detecterAlignementSurColonne(colonne) {
    for (let cookie = 0; cookie < this.c - 2; cookie++) {
      if (this.tabCookies[cookie][colonne].type === this.tabCookies[cookie + 1][colonne].type && this.tabCookies[cookie][colonne].type === this.tabCookies[cookie + 2][colonne].type) {

        //on marque les 3 alignés
        this.tabCookies[cookie][colonne].flag = true;
        this.tabCookies[cookie + 1][colonne].flag = true;
        this.tabCookies[cookie + 2][colonne].flag = true;

        //on l'a fait disparaitre
        this.tabCookies[cookie][colonne].cookieTrouvee();
        this.tabCookies[cookie + 1][colonne].cookieTrouvee();
        this.tabCookies[cookie + 2][colonne].cookieTrouvee();

      }

    }
  }

  detecterTousLesAlignements() {
    for (let ligne = 0; ligne < this.l; ligne++) {
      this.detecterAlignementSurLigne(ligne);
    }
    for (let colonne = 0; colonne < this.c; colonne++) {
      this.detecterAlignementSurColonne(colonne);
    }
  }


  chuteToutesLesColonnes() {
    for (let colonne = 0; colonne < this.c; colonne++) {
      this.chuteColonne(colonne);
    }
  }

  chuteColonne(colonne) {
    for (let index = 0; index < this.c; index++) {
      this.decalageVersLeBas(colonne);
    }
    //on les fait disparaitre
    for (let ligne = 0; ligne < this.l; ligne++) {
      this.tabCookies[ligne][colonne].cookieTrouvee();
    }
  }

  decalageVersLeBas(colonne) {
    for (let ligne = this.l - 1; ligne > 0; ligne--) {
      let cookieSup = this.tabCookies[ligne - 1][colonne];
      let cookieInf = this.tabCookies[ligne][colonne];
      if (cookieInf.flag) {
        Cookie.swapManquant(cookieInf, cookieSup);
      }
    }
    // a ce stades les cookies sont visibles pour faciliter le swap on les ferra disparaitre dans verifierChuteColonne()
  }

  afficherNouveauxCookies() {
    for (let colonne = 0; colonne < this.l; colonne++) {
      for (let ligne = 0; ligne < this.l; ligne++) {
        //on vérifie les cases avec un flag
        if (this.tabCookies[ligne][colonne].flag == true) {
          let type = Math.floor(Math.random() * 6);
          let cookie = new Cookie(type, ligne, colonne);
          this.tabCookies[ligne][colonne] = cookie;
        }
      }

    }
     // on met a jour le dom des changements
     this.showCookies()
  }

}






