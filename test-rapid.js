
const options = {
  method: 'POST',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'x-rapidapi-host': 'instagram-scraper-stable-api.p.rapidapi.com',
    'x-rapidapi-key': 'ce97bf8d01msh9ec046fb1029f08p192762jsn3461f2ccc382'
  },
  body: new URLSearchParams({
    username_or_url: 'https://www.instagram.com/infolomba/',
    amount: '3'
  })
};

fetch('https://instagram-scraper-stable-api.p.rapidapi.com/get_ig_user_posts.php', options)
  .then(res => res.json())
  .then(res => console.log(JSON.stringify(res).slice(0, 300)))
  .catch(err => console.error(err));

