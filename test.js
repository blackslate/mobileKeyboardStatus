;(function test(){

  window.log = function log(message) {   
    let pre = document.querySelector("pre.scroll")

    pre.innerHTML += message + "\n"
  }

  let key = window.keyboard

  key.addEventListener("resize", resize)
  key.addEventListener("keyboardchange", keyboardchange)
  key.addEventListener("focuschange", focuschange)

  function resize(dimensions, orientation) {
    let message =  orientation + " " + dimensions.width + "x" + dimensions.height
    log (message)
  }

  function keyboardchange(state, dimensions) {
    let message =  state + " " + dimensions.width + "x" + dimensions.height
    log (message)
  }

  function focuschange(element, elementType) {
    let message = "focus: " + elementType  
    log (message)
  }
})()
