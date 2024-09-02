document.addEventListener("DOMContentLoaded", () => {
  // عناصر الـ DOM
  const siteName = document.getElementById("bookmarkName");
  const siteURL = document.getElementById("bookmarkURL");
  const submitBtn = document.getElementById("submitBtn");
  const tableContent = document.getElementById("tableContent");
  const closeBtn = document.getElementById("closeBtn");
  const boxModal = document.querySelector(".box-info");
  
  let bookmarks = JSON.parse(localStorage.getItem("bookmarksList")) || [];

  bookmarks.forEach((_, index) => displayBookmark(index));

  
  function displayBookmark(index) {
      const bookmark = bookmarks[index];
      const validURL = /^(https?:\/\/)/.test(bookmark.siteURL) ? bookmark.siteURL : `https://${bookmark.siteURL}`;
      tableContent.innerHTML += `
          <tr>
              <td>${index + 1}</td>
              <td>${bookmark.siteName}</td>
              <td><button class="btn btn-visit" data-index="${index}"><i class="fa-solid fa-eye"></i> Visit</button></td>
              <td><button class="btn btn-delete" data-index="${index}"><i class="fa-solid fa-trash-can"></i> Delete</button></td>
          </tr>
      `;
      addEventListeners();
  }

 
  function addEventListeners() {

      document.querySelectorAll(".btn-visit").forEach(button =>
          button.addEventListener("click", (e) => {
              const index = e.target.dataset.index;
              window.open(bookmarks[index].siteURL, '_blank');
          })
      );

      document.querySelectorAll(".btn-delete").forEach(button =>
          button.addEventListener("click", (e) => {
              const index = e.target.dataset.index;
              bookmarks.splice(index, 1);
              localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
              updateTable();
          })
      );
  }

  function updateTable() {
      tableContent.innerHTML = "";
      bookmarks.forEach((_, index) => displayBookmark(index));
  }

  function clearInput() {
      siteName.value = "";
      siteURL.value = "";
  }

  function validate(element, regex) {
      if (regex.test(element.value)) {
          element.classList.add("is-valid");
          element.classList.remove("is-invalid");
      } else {
          element.classList.add("is-invalid");
          element.classList.remove("is-valid");
      }
  }

  submitBtn.addEventListener("click", () => {
      const nameRegex = /^\w{3,}$/; // اسم الموقع يجب أن يتكون من 3 أحرف على الأقل
      const urlRegex = /^(https?:\/\/)?(www\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/; // تحقق من صحة عنوان URL

      validate(siteName, nameRegex);
      validate(siteURL, urlRegex);

      if (siteName.classList.contains("is-valid") && siteURL.classList.contains("is-valid")) {
          const newBookmark = {
              siteName: siteName.value.trim(),
              siteURL: siteURL.value.trim()
          };
          bookmarks.push(newBookmark);
          localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
          displayBookmark(bookmarks.length - 1);
          clearInput();
          siteName.classList.remove("is-valid");
          siteURL.classList.remove("is-valid");
      } else {
          boxModal.classList.remove("d-none");
      }
  });

  function closeModal() {
      boxModal.classList.add("d-none");
  }

  closeBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
  });
  document.addEventListener("click", (e) => {
      if (e.target.classList.contains("box-info")) closeModal();
  });
});
