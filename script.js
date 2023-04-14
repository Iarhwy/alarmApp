let alTimer = document.querySelector('.alarm__display'),
    alActive = document.querySelector('.alarm__wrapper-active'),
    alSet = document.getElementById('alarm__set'),
    alHourInp = document.getElementById('alarm__hour'),
    alMinInp = document.getElementById('alarm__min'),
    alArray = localStorage.getItem('alarms') ? JSON.parse(localStorage.getItem('alarms')) : [],
    alSound = new Audio('./sounds/alarm.mp3')
    inpArr = [];

let initHour = 0,
    initMin = 0,
    alIndex = 0

const appendZero = val => (val < 10 ? '0' + val : val)

const parseObj = (param, val) => {
    let alObject,
        objIndex,
        exists = false

    alArray.forEach((al, i) => {
        if (al[param] == val) {
            exists = true
            alObject = al
            objIndex = i
            return false
        } else {
            return
        }
    })
    return [exists, alObject, objIndex]
}

function timer() {
    let date = new Date(),
        [hours, mins, secs] = [
            appendZero(date.getHours()), 
            appendZero(date.getMinutes()), 
            appendZero(date.getSeconds())
        ];

    alTimer.innerHTML = `${hours}:${mins}:${secs}`

    alArray.forEach((al, i) => {
        if (al.isActive) {
            if (`${al.alHour}:${al.alMin}` === `${hours}:${mins}`) {
                alSound.play();
                alSound.loop = true
            }
        }
    })
}

const inpCheck = inpVal => {
    inpVal = parseInt(inpVal)
    if (inpVal < 10) {
        inpVal = appendZero(inpVal)
    }
    return inpVal
}

alHourInp.addEventListener('input', () => {
    alHourInp.value = inpCheck(alHourInp.value)
    alHourInp.value = alHourInp.value.substring(0, 2)
    let value = parseInt(alHourInp.value);
    if (value > 23) alHourInp.value = alHourInp.value.slice(0, -2)
})

alMinInp.addEventListener('input', () => {
    alMinInp.value = inpCheck(alMinInp.value)
    alMinInp.value = alMinInp.value.substring(0, 2)
    let value = parseInt(alMinInp.value);
    if (value > 59) alMinInp.value = alMinInp.value.slice(0, -2)
})

const alCreate = (alObj) => {
    const {id, alHour, alMin} = alObj
    let $alSubContainer = document.createElement('div'),
        $alSubContainerNums = document.createElement('span')
    $alSubContainer.classList.add('alarm__subcontainer')
    $alSubContainer.setAttribute('data-id', id)
    $alSubContainerNums.innerHTML = `${alHour}:${alMin}`

    let $alCheck = document.createElement('input')
    $alCheck.setAttribute('type', 'checkbox')
    $alCheck.setAttribute('class', 'checkbox')
    $alCheck.addEventListener('click', e => { 
        if (e.target.checked) {
            alStart(e)
            // e.target.setAttribute('class', 'checked')
            e.target.setAttribute('checked', '')
        } else {
            alStop(e)
            // e.target.removeAttribute('class', 'checked')
            e.target.removeAttribute('checked')
        } 
    })

    // localStorage.getItem('checkStatus') == 'true' 
    //     ? $alCheck.checked = true
    //     : $alCheck.checked = false

    // function savefunction(){
    //     var checkboxes = document.querySelectorAll('.products');
    //     for (var i = 0; i < checkboxes.length; i  = 1) {
    //       if (checkboxes[i].checked) {
    //         localStorage.setItem(checkbox[i].name, checkbox[i].value); // <-- stores a value
    //       } else {
    //         if (localStorage.getItem(checkbox[i].name)) { // <-- check for existance
    //           localStorage.removeItem(checkbox[i].name); // <-- remove a value
    //         }
    //       }
    //     }
    //   }

    let $alDel = document.createElement('button'),
        $alTrashIco = document.createElement('i')
    $alDel.classList.add('alarm__delete')
    $alDel.addEventListener('click', e => alDelete(e))
    $alDel.append($alTrashIco)

    $alSubContainer.append($alSubContainerNums, $alCheck, $alDel)
    alActive.append($alSubContainer)
}



let add = () => {
    let parsedArr = JSON.parse(localStorage.getItem('alarms'))

    parsedArr.forEach(e => {
        let alObj = {}
        alObj.id = e.id
        alObj.alHour = e.alHour
        alObj.alMin = e.alMin
        alObj.isActive = e.isActive
        alCreate(alObj)
    })
}

let alIdRandom = () => {
    alIndex += +(((Math.random() * 1000)).toFixed(1).replace('.', ''))
}

alSet.addEventListener('click', () => {
    alIdRandom()

    let alObj = {}
    alObj.id = `${alIndex}_${alHourInp.value}_${alMinInp.value}`
    alObj.alHour = alHourInp.value
    alObj.alMin = alMinInp.value
    alObj.isActive = false
    alArray.push(alObj)
    localStorage.setItem('alarms', JSON.stringify(alArray))
    alCreate(alObj)
    alHourInp.value = appendZero(initHour)
    alMinInp.value = appendZero(initMin)
    console.log(alArray)
    console.log(document.querySelectorAll('.checked'))
})



const alStart = e => {
    let searchId = e.target.parentElement.getAttribute('data-id'),
        [exists, obj, index] = parseObj('id', searchId)
        if (exists) {
            alArray[index].isActive = true
        }
}

const alStop = e => {
    let searchId = e.target.parentElement.getAttribute('data-id'),
        [exists, obj, index] = parseObj('id', searchId)
        if (exists) {
            alArray[index].isActive = false
            alSound.pause()
        }
}

const alDelete = e => {
    let searchId = e.target.parentElement.parentElement.getAttribute('data-id'),
    [exists, obj, index] = parseObj('id', searchId)
        if (exists) {
            e.target.parentElement.parentElement.remove()
            alArray.splice(index, 1)
            localStorage.setItem('alarms', JSON.stringify(alArray))
        }
};

window.onload = () => {
    setInterval(timer)
    initHour = 0
    initMin = 0
    alIndex = 0
    // alArray = [];
    alArray.length > 0 ? add() : []
    console.log(alArray)
    alHourInp.value = appendZero(initHour)
    alMinInp.value = appendZero(initMin)
};
