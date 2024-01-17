// source: https://www.smashingmagazine.com/2016/07/improving-user-flow-through-page-transitions/
    //grab the main element
    const main = document.getElementsByTagName('main')[0]
    const page = {
        '/': { bgcolor: 'white' },
        '/services': { bgcolor: 'black', color: 'white'},
        '/booking': { bgcolor: 'green' },
        '/community': { bgcolor: 'red' },
        '/about': { bgcolor: 'yellow' },
        '/contact': { bgcolor: 'blue' },
        '/faqs': { bgcolor: 'white' }
    }
    console.log( main )

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
        console.log( document.body.style.backgroundColor )

        let fadeout = oldContent.animate( {
            opacity: [1, 0]
        }, { fill: 'forwards', duration: 250} )
        
        fadeout.onfinish = function() {
            main.appendChild(newContent)
            document.body.animate({
                backgroundColor: [ document.body.style.backgroundColor, page[path].bgcolor ]
            }, { fill: 'forwards', duration: 750} )

            let fadein = newContent.animate({
                opacity: [0, 1]
            }, 750)
            
            fadein.onfinish = function() {
                oldContent.parentNode.removeChild(oldContent)
            }
        }
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



