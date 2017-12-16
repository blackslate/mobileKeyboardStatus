;(function (){

    class Keyboard {
      constructor () {
        this.screenWidth = screen.width        // detect orientation
        this.windowHeight = window.innerHeight // detect keyboard change
        this.listeners = {
          resize: []
        , keyboardchange: []
        , focuschange: []
        }

        this.isTouchScreen = 'ontouchstart' in document.documentElement
      
        this.focusElement = null
        this.changeFocusTime = new Date().getTime()
        this.focusDelay = 1000 // at least 600 ms is required

        let focuschange = this.focuschange.bind(this)
        document.addEventListener("focus", focuschange, true)
        document.addEventListener("blur", focuschange, true)

        window.onresize = this.resizeWindow.bind(this)
      }

      focuschange(event) {
        let target = event.target
        let elementType = null
        let checkType = false
        let checkEnabled = false
        let checkEditable = true

        if (event.type === "focus") {
          elementType = target.nodeName
          this.focusElement = target

          switch (elementType) {
            case "INPUT":
              checkType = true
            case "TEXTAREA":
              checkEditable = false
              checkEnabled = true
            break
          }

          if (checkType) {
            let type = target.type
            switch (type) {
              case "color":
              case "checkbox":
              case "radio":
              case "date":
              case "file":
              case "month":
              case "time":
                this.focusElement = null
                checkEnabled = false
              default:
                elementType += "[type=" + type +"]"
            }
          }

          if (checkEnabled) {
            if (target.disabled) {
              elementType += " (disabled)"
              this.focusElement = null
            }
          }

          if (checkEditable) {
            if (!target.contentEditable) {
              elementType = null
              this.focusElement = null
            }
          }
        } else {
          this.focusElement = null
        }

        this.changeFocusTime = new Date().getTime()

        this.listeners.focuschange.forEach(listener => {
          listener(this.focusElement, elementType)
        })
      }

      resizeWindow() {
        let screenWidth = screen.width;
        let windowHeight = window.innerHeight
        let dimensions = {
          width: innerWidth
        , height: windowHeight
        }
        let orientation = (screenWidth > screen.height)
                        ? "landscape"
                        : "portrait"

        let focusAge = new Date().getTime() - this.changeFocusTime
        let closed = !this.focusElement
                  && (focusAge < this.focusDelay)            
                  && (this.windowHeight < windowHeight)
        let opened = this.focusElement 
                  && (focusAge < this.focusDelay)
                  && (this.windowHeight > windowHeight)

        if ((this.screenWidth === screenWidth) && this.isTouchScreen) {
          // No change of orientation
          
          // opened or closed can only be true if height has changed.
          // 
          // Edge case
          // * Will give a false positive for keyboard change.
          // * The user has a tablet computer with both screen and
          //   keyboard, and has just clicked into or out of an
          //   editable area, and also changed the window height in
          //   the appropriate direction, all with the mouse.
    
          if (opened) {
            this.keyboardchange("shown", dimensions)
          } else if (closed) {
            this.keyboardchange("hidden", dimensions)
          } else {
            // Assume this is a desktop touchscreen computer with
            // resizable windows
            this.resize(dimensions, orientation)
          }

        } else {
          // Orientation has changed
          this.resize(dimensions, orientation)
        }

        this.windowHeight = windowHeight
        this.screenWidth = screenWidth
      }

      keyboardchange(change, dimensions) {
        this.listeners.keyboardchange.forEach(listener => {
          listener(change, dimensions)
        })
      }

      resize(dimensions, orientation) {
        this.listeners.resize.forEach(listener => {
          listener(dimensions, orientation)
        })
      }

      addEventListener(eventName, listener) {
        // log("*addEventListener " + eventName)

        let listeners = this.listeners[eventName] || []
        if (listeners.indexOf(listener) < 0) {
          listeners.push(listener)
        }
      }

      removeEventListener(eventName, listener) {
        let listeners = this.listeners[eventName] || []
        let index = listeners.indexOf(listener)

        if (index < 0) {
        } else {       
          listeners.slice(index, 1)
        }
      }
    }

  window.keyboard = new Keyboard()

})()
