//*Etape 8 : Afficher un tableau récapitulatif des achats dans la page Panier

const itemsHtml = document.getElementById('cart__items');

let product = [];

if (localStorage.getItem('product') === null) {
  // Check if there is something in the localStorage
  window.confirm('Votre panier est vide');
} else {
  // management the cart
  let localStorageCart = JSON.parse(localStorage.getItem('product'));

  //create function to display the cart
  function showBasket(productAPI, productLS) {
    itemsHtml.innerHTML += `<article class="cart__item" data-id="${productLS.id}" data-color="${productLS.color}">
                <div class="cart__item__img">
                  <img src="${productAPI.imageUrl}" alt="${productAPI.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${productAPI.name}</h2>
                    <p>Couleur Selectionnée : ${productLS.color}</p>
                        <div class = "cart__item__content__titlePrice">
                            <p>Prix Unitaire : ${productAPI.price} €</p>
                            <p> Prix Total : ${productAPI.price * productLS.quantity} € </p>
                         </div>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productLS.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
  }

  //create function for shopping cart calculation
  function calcBasket(productAPI, productLS) {
    let totalQuantity = 0;
    let totalPrice = 0;
    //number of products ordered :
    totalQuantity += parseInt(productLS.quantity);
    document.getElementById('totalQuantity').textContent = `${totalQuantity}`;

    //price of products ordered
    totalPrice += productAPI.price * productLS.quantity;
    document.getElementById('totalPrice').textContent = `${totalPrice}`;

    //recover product ID to put in an array to pass the POST request to the API
    product.push(productLS.id);
  }

  //Étape 9 : Gérer la modification et la suppression de produits dans la page Panier
  //create function to modify the cart:
  function changeBasket() {
    let inputsQuantity = document.querySelectorAll('.itemQuantity');

    inputsQuantity.forEach((input) => {
      input.addEventListener('change', (e) => {
        let articleHMTL = e.target.closest('article');
        let articleHTMLId = articleHMTL.dataset.id;
        let articleHTMLcolor = articleHMTL.dataset.color;

        //le premier article dans le local storage qui respecte la condition
        let articleChanged = localStorageCart.find(
        (e) => e.id === articleHTMLId && e.color === articleHTMLcolor
       );

        if (articleChanged !== undefined) {
          articleChanged.quantity = parseInt(e.target.value);

          if (articleChanged.quantity > 100) {
            alert('Attention, la quantité à été limitée à 100');
            e.target.value = 100;
            articleChanged.quantity = parseInt(e.target.value);
            localStorage.setItem(
              'product',
              JSON.stringify(localStorageCart)
            );
          } else if (articleChanged.quantity <= 0) {
            localStorageCart = localStorageCart.filter((e) => !(e.id === articleHTMLId && e.color === articleHTMLcolor));
            articleHMTL.remove();
            localStorage.setItem('product', JSON.stringify(localStorageCart));

            if (localStorageCart.length < 1) {
              localStorage.clear('product');
            }
          } else {
            localStorage.setItem('product', JSON.stringify(localStorageCart));
          }
        } else {
          localStorage.clear('product');
          alert("Désolé, une erreur s'est produite, nous n'avons pas pu finalier votre commande, veuillez réessayer plus tard");
        }
        location.reload();
      });
    });
  }




  localStorageCart.forEach((productLS) => {
    // Pour chaque produit dans le local Storage récupérer son id
    fetch(`http://localhost:3000/api/products/${productLS.id}`) // Requete à l'API de l'ID récupéré dans le local Storage
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then((productAPI) => {
        // Affichage du panier
        showBasket(productAPI, productLS);
        calcBasket(productAPI, productLS);
        changeBasket();
        deleteBasket();
      });
  }); 
}