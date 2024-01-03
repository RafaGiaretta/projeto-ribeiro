import storage from "./firebase.js";
import { ref, list, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js"

const setStoragePath = (storage) => {
  const url = new URL(window.location.href);
  const urlParams = url.searchParams.get('folder');
  return ref(storage, urlParams);
}

const listAllFolders = async () => {
  const storagePath = setStoragePath(storage);
  const folders = await list(storagePath);
  return folders.prefixes; 
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
    folderImg.src = 'https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg';

    const folderName = document.createElement('p');
    folderName.innerHTML = folderRef.name;

    folderCard.appendChild(folderImg);
    folderCard.appendChild(folderName);
    foldersContainer.appendChild(folderCard);
  });
}

window.onload = () => {
  renderFolders();
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
