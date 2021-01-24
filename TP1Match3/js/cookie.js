class Cookie {
  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  constructor(type, ligne, colonne) {
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;
    this.flag = false; //marque de la cookie --- true = marqué
    // création d'un élément en html
    this.htlmImage = document.createElement('img');
    this.htlmImage.src = Cookie.urlsImagesNormales[this.type];
    this.htlmImage.width = 80;
    this.htlmImage.height = 80;
    this.htlmImage.dataset.colonne = colonne;
    this.htlmImage.dataset.ligne = ligne;
    this.htlmImage.classList.add("cookies");
  }

  selectionnee() {
    this.htlmImage.src = Cookie.urlsImagesSurlignees[this.type];
    this.htlmImage.classList.add("cookies-selected");
  }

  deselectionnee() {
    this.htlmImage.src = Cookie.urlsImagesNormales[this.type];
    this.htlmImage.classList.remove("cookies-selected");
    this.htlmImage.classList.add("cookies");
  }

  static swapCookies(c1, c2) {
    // On échange leurs images et types
    let typeTmp = c2.type;
    let htmlSrcTmp = c2.htlmImage.src;

    c2.type = c1.type;
    c2.htlmImage.src = c1.htlmImage.src;

    c1.type = typeTmp;
    c1.htlmImage.src = htmlSrcTmp;


    // et on remet les désélectionne
    c1.deselectionnee();
    c2.deselectionnee();
  }

  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    return distance;
  }

  static swapManquant(c1, c2){
    //on réaffiche tous les cookies aligné pour pouvoir les swaps
    c1.htlmImage.classList.remove("cookie-trouvee");

    //on reprend la structure de swapCookies() en ajoutant les flags pour les swaps
    let flagTmp = c2.flag;
    c2.flag = c1.flag;
    c1.flag = flagTmp;

    this.swapCookies(c1,c2);
  }

  cookieTrouvee(){
    if(this.flag){
      this.htlmImage.classList.add("cookie-trouvee");
    }
    
  }
}
