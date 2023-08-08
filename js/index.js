// document.addEventListener("DOMContentLoaded", function() {});

const bookList = document.querySelector("ul#list");
const showPanel = document.querySelector(`div#show-panel`);

const sampleUser = { id: 1, username: "Barry" };

const displayBook = (book) => {
  showPanel.innerHTML = "";
  const image = document.createElement("img");
  image.src = book.img_url;
  const title = document.createElement("h1");
  title.textContent = book.title;
  showPanel.append(image, title);
  if (book.subtitle) {
    const subtitle = document.createElement("h2");
    subtitle.textContent = book.subtitle;
    showPanel.append(subtitle);
  }
  const author = document.createElement("h3");
  author.textContent = book.author;
  const summary = document.createElement("p");
  summary.textContent = book.description;
  const likes = document.createElement("ul");
  book.users.forEach((user) => {
    const like = document.createElement("li");
    like.textContent = user.username;
    likes.append(like);
  });
  const likeButton = document.createElement("button");
  if (!book.users.find((u) => u.id === sampleUser.id)) {
    likeButton.textContent = "Like";
  } else {
    likeButton.textContent = "Unlike";
  }
  likeButton.addEventListener("click", (e) => {
    if (!book.users.find((u) => u.id === sampleUser.id)) {
      book.users.push(sampleUser);
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: book.users }),
      });
      const like = document.createElement("li");
      like.textContent = sampleUser.username;
      likes.append(like);
      likeButton.textContent = "Unlike";
    } else {
      book.users = book.users.filter((user) => user.id !== sampleUser.id);
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: book.users }),
      });
      likes.innerHTML = "";
      book.users.forEach((user) => {
        const like = document.createElement("li");
        like.textContent = user.username;
        likes.append(like);
      });
      likeButton.textContent = "Like";
    }
  });
  showPanel.append(author, summary, likes, likeButton);
};

fetch("http://localhost:3000/books")
  .then((r) => r.json())
  .then((books) => {
    console.log(books);
    books.forEach((book) => {
      const li = document.createElement("li");
      li.textContent = book.title;
      li.addEventListener("click", () => {
        displayBook(book);
      });
      bookList.append(li);
    });
  });
