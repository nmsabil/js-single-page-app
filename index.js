const galleryNames = document.querySelector(".list-of-gallery");
const galleryInfo = document.querySelectorAll(".gallery-info div");
const galleryMap = document.querySelector(".map iframe");

let galleryUrl =
  "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php";

fetch(galleryUrl)
  .then((response) => response.json())
  .then(function (galleries) {
    galleries.map((gallery) => {
      let galleryName = document.createElement("div");
      galleryName.addEventListener("click", (e) => {
        let data = galleries.find(
          (el) => el.GalleryName === e.target.innerText
        );
        galleryInfo[0].innerHTML = `<b>Name:</b> ${data.GalleryName}`;
        galleryInfo[1].innerHTML = `<b>Native Name:</b> ${data.GalleryNativeName}`;
        galleryInfo[2].innerHTML = `<b>City:</b> ${data.GalleryCity}`;
        galleryInfo[3].innerHTML = `<b>Address:</b> ${data.GalleryAddress}`;
        galleryInfo[4].innerHTML = `<b>Country:</b> ${data.GalleryCountry}`;
        galleryInfo[5].innerHTML = `<b>Website:</b> <a href="${data.GalleryWebSite}">${data.GalleryWebSite}</a>`;
        initMap(data.Longitude, data.Latitude);
        document.querySelector(".painting-content").innerHTML = "";
        fetchPainting(
          `https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=${data.GalleryID}`
        );
      });
      galleryName.className = "gallery-name";
      galleryName.innerText = gallery.GalleryName;
      galleryNames.appendChild(galleryName);
    });
  });

// Reference | https://stackoverflow.com/questions/41391302/convert-latitude-longitude-to-iframe-link
function initMap(a, b) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: b, lng: a },

    zoom: 15,
  });
}

let paintingContainer = document.querySelector(".painting-content");
const fetchPainting = (galleryId) => {
  fetch(galleryId)
    .then((response) => response.json())
    .then(function (paintings) {
      paintings.map((painting) => {
        const imgLink = `https://res.cloudinary.com/funwebdev/image/upload/w_500/art/paintings/${painting.ImageFileName}`;

        const paintingDetails = `<div class="painting-details" onclick="fetchPaintingDetails(
          ' ${painting.Title} ', 
          ' ${painting.FirstName} ', 
          ' ${painting.LastName} ',
          ' ${painting.GalleryName} ',
          ' ${painting.GalleryCity} ',
          ' ${painting.MuseumLink} ',
          ' ${painting.CopyrightText} ',
          ' ${painting.YearOfWork} ',
          ' ${painting.Width} ',
          ' ${painting.Height} ',
          ' ${painting.Medium} ',
          ' ${
            typeof painting.Description === "object"
              ? "Does not exist"
              : painting.Description.replace(/'/g, "&rsquo; ").replace(
                  /"/g,
                  "&quot; "
                )
          } ',
          ' ${imgLink} ',
          
        )">
  <div class='artist-img'>
    <img 
      src= ${imgLink}
      alt=''
    />
  </div>
  <div class='artist-name'>${painting.FirstName} ${painting.LastName}</div>
  <div class='artist-title'>${painting.Title}</div>
  <div class='artist-year'>${painting.YearOfWork}</div>
</div>`;

        paintingContainer.innerHTML += paintingDetails;
      });

      sorting();
    });
};

// Reference | https://medium.com/@cmstie/sorting-an-html-collection-with-javascript-2756d692b150

function sorting() {
  let container = document.querySelector(".painting-content");
  let divCard = container.children;

  divCard = Array.prototype.slice.call(divCard);

  divCard.sort(function (a, b) {
    if (a.textContent < b.textContent) {
      return -1;
    } else {
      return 1;
    }
  });
  container.innerHTML = "";
  for (var i = 0, l = divCard.length; i < l; i++) {
    container.appendChild(divCard[i]);
  }
}

const fetchPaintingDetails = (
  Title,
  FirstName,
  LastName,
  GalleryName,
  GalleryCity,
  MuseumLink,
  CopyrightText,
  YearOfWork,
  Width,
  Height,
  Medium,
  Description,
  imgLink
) => {
  const singlePageView = document.querySelector(".single-painting-view");

  singlePageView.classList.remove("d-none");

  const singlePaintingContent = ` <div class="image">
  <img
    src="${imgLink}"
    alt=""
  />
</div>
<div class="description">
  <div class="paintingTitle"><b>Painting Title:</b>${Title}</div>
  <div class="paintingFirstName"><b>FirstName:</b> ${FirstName}</div>
  <div class="paintingLastName"><b>LastName:</b> ${LastName}</div>
  <div class="paintingGalleryName">
    <b>Gallery Name:</b> ${GalleryName}
  </div>
  <div class="paintingGalleryCity"><b>Gallery City:</b> ${GalleryCity}</div>
  <div class="paintingMuseumLink">
    <b>Museum Website:</b>
    <a href="${MuseumLink}"
      >${MuseumLink}</a
    >
  </div>
  <div class="paintingCopyright"><b>Copyright:</b> ${CopyrightText}</div>
  <div class="paintingYearOfWork"><b>Year Of Work:</b> ${YearOfWork}</div>
  <div class="paintingWidth"><b>Width:</b> ${Width}</div>
  <div class="paintingHeight"><b>Height:</b> ${Height}</div>
  <div class="paintingMedium"><b>Medium</b> ${Medium}</div>
  <div class="paintingDescription pt-5">
  <b>Description:</b> ${Description}
  </div><button class="close-button mt-5">Close Button</button></div>`;
  singlePageView.insertAdjacentHTML("afterbegin", singlePaintingContent);
  const closeButton = document.querySelector(".close-button");

  closeButton.addEventListener("click", function () {
    const singlePainting = document.querySelector(".single-painting-view");
    singlePainting.innerHTML = "";
    singlePainting.classList.add("d-none");
  });
  const singlePainting = document.querySelector(".single-painting-view");

  const largerImageDisplay = (e) => {
    largeImage.querySelector("img").src = e.target.src.replace(/500/g, "600");
    largeImage.classList.remove("limage-d-none");
    singlePainting.classList.add("d-none");
  };
  const closeLargeScreen = () => {
    largeImage.classList.add("limage-d-none");
    singlePainting.classList.remove("d-none");
  };
  const largeImage = document.querySelector(".large-image");
  largeImage.addEventListener("click", closeLargeScreen);

  document
    .querySelector(".image")
    .addEventListener("click", largerImageDisplay);
};
document.querySelector(".artist").addEventListener("click", sorting());
document.querySelector(".title").addEventListener("click", sorting());
document.querySelector(".Year").addEventListener("click", sorting());
