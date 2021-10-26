const express = require("express")
const fs = require("fs")
const path = require("path")
var cors = require("cors")
var bodyParser = require("body-parser")
const tokenizer = require("./compiler/tokenizer")
const parser = require("./compiler/parser")

const app = express()
const port = process.env.PORT || 3030
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const iconFiles = {
  ".html": "mdi-language-html5",
  ".js": "mdi-nodejs",
  ".json": "mdi-code-json",
  ".md": "mdi-language-markdown",
  ".pdf": "mdi-file-pdf",
  ".png": "mdi-file-image",
  ".txt": "mdi-file-document-outline",
  ".xls": "mdi-file-excel",
  ".cpp": "mdi-language-cpp",
}

const readFolder = (folder, fullDirectory) => {
  const filelist = []

  fs.readdirSync(folder).forEach((file) => {
    if (fs.statSync(folder + path.sep + file).isDirectory()) {
      filelist.push({
        name: file,
        children: readFolder(
          `${folder}${path.sep}${file}${path.sep}`,
          `${folder}${path.sep}${file}${path.sep}`
        ),
      })
    } else {
      filelist.push({
        name: file,
        icon: iconFiles[path.extname(file)],
        directory: `${fullDirectory}${path.sep}${file}`,
        content: fs.readFileSync(`${fullDirectory}${path.sep}${file}`, "utf-8"),
      })
    }
  })

  return filelist
}

app.use(cors())
const workspaceDirectory = `.${path.sep}workspace${path.sep}`

app.get("/file/workspace", (req, res) => {
  const filelist = readFolder(workspaceDirectory, `${workspaceDirectory}`)

  res.send(filelist)
})

app.post("/folder", (req, res) => {
  let folder = req.body.folder_name.split("/")
  let folderCreated = workspaceDirectory
  folder.forEach((f) => {
    if (fs.existsSync(folderCreated + path.sep + f)) {
      return res.status(400).send()
    }
    fs.mkdirSync(folderCreated + path.sep + f)
    folderCreated += path.sep + f
  })

  res.send().status(200)
})

app.post("/compiler", (req, res) => {
  const cpp = req.body.content
  const tokens = tokenizer(cpp)
  const parsed = parser(tokens)

  res.send({ tokens: tokens, parsed: parsed }).status(200)
})

app.post("/file", (req, res) => {
  let folder = req.body.file_name.split("/")
  let folderCreated = workspaceDirectory

  folder.forEach((f) => {
    if (
      !fs.existsSync(folderCreated + path.sep + f) &&
      path.extname(f) === ""
    ) {
      fs.mkdirSync(folderCreated + path.sep + f)
    }
    if (path.extname(f) !== "") {
      fs.writeFile(folderCreated + path.sep + f, "", () => {})
    }

    folderCreated += path.sep + f
  })

  res.send().status(200)
})

app.post("/file/write", async (req, res) => {
  let fileDirectory = "."
  req.body.file.directory.forEach((d) => {
    fileDirectory += path.sep + d.text
  })

  await fs.writeFileSync(fileDirectory, "", function(err) {
    if (err) console.log(err)
  })

  await fs.writeFileSync(
    fileDirectory,
    req.body.file.content,
    { enconding: "utf-8", flag: "a" },
    function(err) {
      if (err) console.log(err)
    }
  )
})

app.post("/file/delete", async (req, res) => {
  const checked = fs
    .statSync(`${workspaceDirectory}${path.sep}${req.body.directory}`)
    .then(() => {
      if (checked.isDirectory()) {
        fs.rmdirSync(`${workspaceDirectory}${path.sep}${req.body.directory}`, {
          recursive: true,
        })
        return res.status(200).send()
      }
    })

  fs.unlink(req.body.directory, function(err) {
    if (err) return console.log(err)
    return res.status(200).send()
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
