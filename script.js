// source: https://www.smashingmagazine.com/2016/07/improving-user-flow-through-page-transitions/
    //grab the main element
    const main = document.getElementsByTagName('main')[0],
    imgs = document.getElementsByClassName('logo')
    console.log( imgs )
    let state = {
        bgColor: document.body.style.backgroundColor,
        color: document.body.style.color
    }

    const page = {
        '/': { id: 'logo', bgColor: 'white', color: 'black' },
        '/services': { id: 'l1', bgColor: 'black', color: 'white'},
        '/booking': { id: 'l2', bgColor: '#009444', color: 'black' },
        '/community': { id: 'l3', bgColor: '#ED1C24', color: 'black' },
        '/about': { id: 'l4', bgColor: '#FFF200', color: 'black' },
        '/contact': { id: 'l5', bgColor: '#2B3990', color: 'white' },
        '/faqs': { id: 'logo', bgColor: 'white', color: 'black' }
    }

    function loadPage(url) {
        return fetch( url, {
            method: 'GET'
        }).then( response => { return response.text() })
    }

    function changePage() {
        let url = window.location.href,
        path = window.location.pathname
        
        loadPage( url ).then( resptext => {
            let wrapper = document.createElement('div')
            wrapper.innerHTML = resptext 
        
            let oldContent = main.querySelector('.content'),
            newContent = wrapper.querySelector('.content')
            animate( oldContent, newContent, path )
        })        
    }

    function animate( oldContent, newContent, path ) {
        oldContent.style.position = 'absolute'
        console.log( document.body.style )
        
        for( let img of imgs ) {
            if( img.id != page[path].id ) { img.style.visibility = 'hidden'}
        }

        window.setTimeout( () => {
            let fadeout = oldContent.animate( {
                opacity: [1, 0]
            }, { fill: 'forwards', duration: 150} )

            fadeout.onfinish = function() {
                main.appendChild(newContent)
                console.log(`before: ${state.bgColor} ${state.color}`)
                document.body.animate({
                    backgroundColor: [ state.bgColor, page[path].bgColor ]
                }, { fill: 'forwards', duration: 750} )
                state.bgColor = page[path].bgColor
                
                document.body.animate( {
                    color: [state.color, page[path].color ],
                    borderColor: [state.color, page[path].color]
                }, { fill: 'forwards', duration: 500 })
                state.color = page[path].color

                let fadein = newContent.animate({
                    opacity: [0, 1]
                }, 500)
                
                fadein.onfinish = function() {
                    console.log(`after: ${state.bgColor} ${state.color}`)
                    oldContent.parentNode.removeChild(oldContent)
                }
            }
        }, 250)
    }



    //window and document event handlers
    window.addEventListener('popstate', changePage)
    document.addEventListener('click', (event) => {
        let el = event.target
        
        while( el && !el.href ) {
            el = el.parentNode
        }

        if( el ) {
            event.preventDefault()
            history.pushState(null, null, el.href)
            changePage()
            return
        }
    })



