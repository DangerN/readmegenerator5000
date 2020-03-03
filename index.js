const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

const questions = [
  {
    message: "Enter your GitHub username:",
    name: "username"
  },
  {
    message: "What is your favorite color?",
    name: "favcolor",
    type: "list",
    choices: ['red', 'blue', 'green']
  }
]

function makeHTML(color) {
  return `<p>${color}</p>`
}

inquirer
  .prompt(questions)
  .then(function(ans) {
    const { username, favcolor } = ans
    const queryUrl = `https://api.github.com/users/${username}/repos?per_page=1`;
    axios.get(queryUrl).then(function(res) {
      const repoNames = res.data.map(function(repo, index) {
        console.log(res.data);
        console.log('res.data', res.data[index].owner)
        console.log('repo', repo.owner);
        return repo.owner.avatar_url;

      });

      const repoNamesStr = repoNames.join("\n");

      fs.writeFile("repos.txt", repoNamesStr, function(err) {
        if (err) {
          throw err;
        }
        console.log(`Saved ${repoNames.length} repos`);
      });
      fs.writeFile("html.html", makeHTML(favcolor), function (err) {
        console.log(err);
      })
    });
  });
