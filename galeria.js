import storage from "./firebase.js";
import { ref, list, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js"

const setStoragePath = (storage, name) => {
  const url = new URL(window.location.href);
  let urlParams = url.searchParams.get('folder');
  if (name !== undefined) {
    urlParams = urlParams + '/' + name;
  }
  return ref(storage, urlParams);
}

const listAllFolders = async () => {
  const storagePath = setStoragePath(storage);
  const folders = await list(storagePath);
  return folders.prefixes; 
}

const listAllImages = async () => {
  const storagePath = setStoragePath(storage);
  const images = await list(storagePath);
  return images.items;
}

const createFolderLink = (folderRef) => {
  const url = new URL(window.location.href)
  const urlParams = url.searchParams.get('folder')
  let newUrlParams
  if (urlParams) {
    newUrlParams = urlParams + '/' + folderRef.name
  } else {
    newUrlParams = folderRef.name
  }
  url.searchParams.set('folder', newUrlParams)
  return url;
}

const renderFolders = async () => {
  const folders = await listAllFolders();
  const foldersContainer = document.getElementById('folders-list');

  folders.forEach(async (folderRef) => {
    const folderCard = document.createElement('a');
    folderCard.id = 'folder-card';
    folderCard.href = createFolderLink(folderRef);
    
    const folderImg = document.createElement('img');
    const capaImageRef = setStoragePath(storage, `${folderRef.name}/capa.jpg`);
    try {
      folderImg.src = await getDownloadURL(capaImageRef);
    } catch {
      folderImg.src = 'https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg';
    }

    const folderName = document.createElement('p');
    folderName.innerHTML = folderRef.name;

    folderCard.appendChild(folderImg);
    folderCard.appendChild(folderName);
    foldersContainer.appendChild(folderCard);
  });
}

const renderImages = async () => {
  const images = await listAllImages();
  const imagesContainer = document.getElementById('folders-list');

  images.forEach(async (imageRef) => {
    if (imageRef.name === 'capa.jpg') return
    const imgPath = await getDownloadURL(imageRef);
    const img = document.createElement('img');
    img.classList.add('photo');
    img.src = imgPath;
    imagesContainer.appendChild(img);
  });
}



const fileForm = document.getElementById('file-form')

fileForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const fileInput = e.target[0]
  console.log(fileInput)
  const files = fileInput.files

  Object.values(files).forEach(async (file) => {
    if (file && file.type.startsWith('image/')) {
      const resizedFile = await resizeImage(file, 800, 600) 
      await uploadBytes(setStoragePath(storage, `${Date.now()}`), resizedFile)
    }
  });

})

function resizeImage(file, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = function () {
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height *= maxWidth / width
        width = maxWidth
      }

      if (height > maxHeight) {
        width *= maxHeight / height
        height = maxHeight
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name, { type: file.type }))
      }, file.type)
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

window.onload = async () => {
  const folders = await listAllFolders();
  if (folders.length > 0) {
    renderFolders();
  } else {
    renderImages();
  }
}

// listAllFolders().then((folders) => {
//   folders.forEach(async (folderRef) => {
//     const foldersList = document.getElementById('folders-list')
//     const url = new URL(window.location.href)
//     const params = url.searchParams.get('folder')

//     const imgRef = ref(storage, `${folderRef.name}.jpeg`)

//     const card = document.createElement('div')

//     const img = document.createElement('img')
//     img.style.width = '200px'

//     try {
//       img.src = await getDownloadURL(imgRef)
//     } catch {
//       img.src = 'https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg'
//     }


//     const folderLink = document.createElement('button')
//     folderLink.innerHTML = folderRef.name
//     const caminho = params !== null ? params + '/' : ''
//     const newCaminho = caminho + folderRef.name

//     url.searchParams.set('folder', newCaminho)

//     folderLink.addEventListener('click', () => {
//       document.location.href = url
//     })
    
//     card.appendChild(img)
//     card.appendChild(folderLink)
//     foldersList.appendChild(card)
//   });
// });



// const listAll = async () => {
//  const test = await list(storageRef)
//  return test
// }

// var fotosList = await listAll()

// fotosList.items.forEach( async (itemRef) => {
//   const imgPath = await getDownloadURL(itemRef)
//   document.getElementById('imgs-container').appendChild(document.createElement('img')).src = imgPath
// })

// const fileForm = document.getElementById('file-form')

// fileForm.addEventListener('submit', async (e) => {
//   e.preventDefault()
//   const file = e.target[0].files[0]
//   await uploadBytes(ref(storageRef, `${Date.now()}`), file)
// })
