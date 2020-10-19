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
        const imgLink = `https://res.cloudinary.com/funwebdev/image/upload/w_100/art/paintings/${painting.ImageFileName}`;

        const paintingDetails = `<div class='painting-details'>
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
    });
};
