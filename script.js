let currentSong = new Audio()
let songs;
let currentFolder;
function secondsToMinutesSeconds(seconds) {
    // Ensure the input is a non-negative number
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Add leading zero if seconds is less than 10
    const formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    // Combine minutes and seconds into the desired format
    const formattedTime = `${minutes}:${formattedSeconds}`;

    return formattedTime;
}
async function getSongs(folder){
    currentFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${currentFolder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    // console.log(div)
    let as = div.getElementsByTagName("a")
    // console.log(as[3].href)
    songs = []
    for (let index = 0; index < as.length; index++){
        const element = as[index]
        if(element.href.endsWith(".mp3")){
            // console.log(element.href)
            // console.log(element.href.split("/songs/")[1])
            songs.push(element.href.split(`/${currentFolder}/`)[1])
            // console.log(element.href.split("/songs/")[1])
        }
    }

    // Show all the songs in playlists  


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    // console.log(songUL)
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li>
                      <img class="invert " src="All svg/music.svg" alt="">
                      <div class="info" style="width: 120px; overflow: hidden; height: 30px;">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>Song Artist</div>
                      </div>
                      <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert music" src="All svg/play.svg" alt="">
                      </div>
                     </li>        
        `
        
    }
    // Attach an eventlistener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
    
}

const playMusic  = (track)=>{
    currentSong.src = `/${currentFolder}/`+track
    // console.log(currentSong.src)
    
        currentSong.play()
        play.src = "All svg/pause.svg"
    
    

    document.querySelector(".songName").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".songCardContainer")
        let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
            if(e.href.includes("/songs/")){
                let folder = e.href.split("/").slice(-2)[1]
                let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
                let response = await a.json()
                // console.log(response)
                cardContainer.innerHTML = cardContainer.innerHTML + `
                <div class="card " data-folder="${folder}">
                            <img src="/songs/${folder}/cover.jpeg" alt="">
                            <div class="circle-container">
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 16">
                                  <path d="M0 .984v14.032a1 1 0 0 0 1.506.845l12.006-7.016a.974.974 0 0 0 0-1.69L1.506.139A1 1 0 0 0 0 .984Z"/>
                                </svg>
                              </div>
                            <h2 style="height:57px">${response.title}</h2>
                            <p>${response.description}</p>
    
                        </div>
                `
                
            }    
        }
        
    

    // Load the selected playlist
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0].replaceAll("%20"," "))
            
        })
    })
}

async function main(){
    await getSongs("songs/album-2")
    // console.log(songs)
    displayAlbums()
    // Display all the albums 


    // Adding play, pause, next, previous button alive
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "All svg/pause.svg"
        }
        else{
            currentSong.pause() 
            play.src = "All svg/play.svg"
        }
    })

    // Time Update functionalities
    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)* 100 +"%"
    })

    // adding function to enable seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        console.log(percent)
        document.querySelector(".circle").style.left = (percent + "%")
        currentSong.currentTime = ((currentSong.duration)* percent)/100;
        console.log(currentSong.currentTime)
        // console.log(e)
    }
    )

    // Adding eventlistener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".cross").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-110%"
        
        
    })

    // Adding next button enable
    previous.addEventListener("click",() =>{
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0])
        if((index-1)>= 0){
            playMusic(songs[index-1].replaceAll("%20"," "))
        }

    })
    next.addEventListener("click",() =>{
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0])
        // console.log(currentSong.src.split("/").splice(-1)[0])
        if((index+1) < songs.length){
            // console.log()
            playMusic(songs[index+1].replaceAll("%20"," "))
        }

    })

    // Adding volume botton 
    document.querySelector(".vol").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        currentSong.volume = parseInt(e.target.value)/100
        console.log(parseInt(e.target.value))
    })


    // Add event listener mute volume
    document.querySelector(".vol>img").addEventListener("click", e=>{
        if(e.target.src.includes("All svg/volume.svg")){
            e.target.src = e.target.src.replace("All svg/volume.svg", "All svg/mute.svg")
            currentSong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            e.target.src = e.target.src.replace("All svg/mute.svg", "All svg/volume.svg")
            currentSong.volume = .10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 100

        }
    })

    
}

main()
   