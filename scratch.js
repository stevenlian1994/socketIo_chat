var localStorage = {'arr':[]}

function pairUp(myDict){
    if (myDict['arr'].length == 0 || myDict['arr'][(myDict['arr'].length-1)].length>1){
        //create new room if not paired up
        var ranNum = Math.ceil(Math.random()*10000);
        myDict['arr'].push([ranNum])
    } else {
        // else pair up
        myDict['arr'][(myDict['arr'].length-1)][1] = 1
    }
    console.log(myDict)
    return myDict
}

pairUp(localStorage)
pairUp(localStorage)
pairUp(localStorage)
pairUp(localStorage)
pairUp(localStorage)
pairUp(localStorage)