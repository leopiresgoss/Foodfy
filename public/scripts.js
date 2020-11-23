const currentPage = location.pathname
const menuItems = document.querySelectorAll("header div .links a")

/* search box */
if(currentPage == "/chefs") {
    const search = document.querySelector("header div .search_box")
    search.classList.add('hidden')
}
/* header links */
for (item of menuItems) {
    console.log(item.getAttribute("href"))
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}

/* recipes subtitle */
const search = document.querySelector('input[name=search_value]')
const subtitle = document.querySelector('.public_recipes_show .subtitle')
if(search) {
    console.log(search)
    if (!search.value) {
        subtitle.classList.add('hidden')
    }
}

/*PHOTOS UPLOAD*/
const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    
    handFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target
        if (PhotosUpload.photosLimit(event)) return

        Array.from(fileList).forEach(file => {
            const reader = new FileReader()

            PhotosUpload.files.push(file) 

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
        
    },
    photosLimit(event) {
        const { uploadLimit } = PhotosUpload
        const { files: fileList } = event.target

        if(fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true 
        }

        const photosDiv = []
        this.preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value=="photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length

        if(totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()

            return true
        }
        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
        console.log(dataTransfer.files)
        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto
        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i') //criando um material icon
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.slice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeEditPhoto(event){
        const photoDiv = event.target.parentNode

        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if(removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const AvatarUpload = {
    input: "",
    uploadLimit: 1,
    preview_url: document.querySelector('#avatar-link'),
    files: [],

    handFileInput() {

        const div = this.getContainer()

        this.preview_url.appendChild(div)

        const input_url = this.preview_url.children
        if(input_url.length > this.uploadLimit) {
            input_url[input_url.length - 1].remove()
        }
        
    },
    getContainer() {
        const div = document.createElement('div')
        div.classList.add('avatar_url')
        
        const input = document.createElement('input')
        input.type = "url"
        input.name = "avatar_input"
        input.placeholder = "http://"
    
        div.appendChild(input)
       
        return div
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e
        
        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
    }
}

/*Validate*/
const Validate = {
    apply(input, func){
        const allInputs = document.querySelectorAll(".user_input")
        Validate.clearErrors(allInputs)
        
        let results = Validate[func](input.value)
        input.value = results.value
        
        if(results.error){
            Validate.displayError(allInputs, results.error)
            input.focus()   
        }
    },
    displayError(allInputs, error){
        for (user_input of allInputs) {
            user_input.classList.add('active')
        }
        const body = document.querySelector("body")
        const div = document.createElement('div')
        div.classList.add('message', 'error')
        div.innerHTML = error 

        body.appendChild(div)
    },
    clearErrors(allInputs) {
        for (user_input of allInputs) {
            user_input.classList.remove('active')
        }
    },
    isEmail(value){
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+(\.-]?\w+)*(\.\w{2,3})+$/

        if(!value.match(mailFormat))
            error = "E-mail Inválido"
        return {
            error,
            value
        }
    }
}
