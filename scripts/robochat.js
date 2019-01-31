class SimpleChatBot {

    constructor( inputTextParam, registerTextParam ){

        this.inputText = document.getElementById( inputTextParam )
        this.registerText = document.getElementById( registerTextParam )
        this.labelInputText = document.querySelector( `[for=${inputTextParam}]` )

        this.Main()
        this.labelInputTextFn()
    }

    labelInputTextFn(){

        if ( this.inputText.value.length < 1 ) { 
            
            this.labelInputText.innerHTML = 'Sugestões' 

        } else {

            this.labelInputText.addEventListener('click', () => { 
                
                this.inputText.value = this.labelInputText.innerHTML 
            })
        }
    }

    error( err ){

        if ( err == 1 ) { return 'Você precisa perguntar algo' }
        if ( err == 2 ) { return 'Tente outra pergunta' }
        if ( err == 3 ) { return 'Digite algo por favor' }

        return false
    }

    Main(){

        this.inputText.addEventListener('keyup', event => {

            let text = event.target.value
            let textNoT = this.replaceSpecialChar( text )
            
            this.searchQuestions( textNoT )                   
            this.labelInputTextFn()
                       
                if ( event.key == 'Enter' ) {

                    if ( !text.length ){ 
                        
                        this.sendMss( this.error(3) )

                    }  else if ( text.length < 10 ){
                        
                        this.sendMss( this.error(1) )
                    }
                    else {
                    
                        this.sendMss( `<span class="me">${text}<span>` )
                        this.searchQuestions( textNoT )
                        this.response( this._ID )
                    }
                }
        })
    }

    searchQuestions( textNoT ){
                
        let text = textNoT.split(' ')
        const collections = []
       
        text.forEach( values => {
            
            let findText = values.trim().replace( /\s/gi , '' )
            const regexText = new RegExp(findText)
           
            for ( let i in myQuestions ){

                let indexPosition = myQuestions[i].req.toLowerCase().match( regexText )
                if ( indexPosition !== null | 0 && indexPosition[0] == findText ) { collections.push(i) }         
            }
            
        });

        this.typesQuestions( collections )
    }
    
    typesQuestions( collections ){
    
        const countCollections = {}
        collections.forEach( x => countCollections[x] = ( countCollections[x] || 0 ) + 1 );  

        let _resCollection = Object.entries( countCollections ).reduce(( old, curr ) => {

            if ( old[1] < curr[1] ) return curr 
            return old

        }, ['0',0] )

        this._ID = _resCollection[0]
        this._SIZE = _resCollection[1]
        this.labelInputText.innerHTML = myQuestions[this._ID].req
    }

    response( id ){

        if ( this._SIZE < 2 ) { this.sendMss( this.error( 2 ) ) }
        else { setTimeout( () => this.sendMss( myQuestions[id].res ), 1234 ) }
    }

    sendMss( mss ){

        this.registerText.innerHTML += `<span class="bot">${mss}<span><br>`
        this.inputText.value = ''
        this.registerText.scrollTop += 200
        this.labelInputTextFn();
    }

    replaceSpecialChar( value ){

        const _input = { 
            a: /[àáâã]/gi, e: /[èéê]/gi, i: /[ìíî]/gi, o: /[òóõô]/gi, u: /[ùúû]/gi, c: /[ç]/gi,
            oth: /[!|?|.|,|/|\\|]/gi,
            vc: /vc/gi, td:/td/gi, oq:/oq/gi, pq:/pq/
        }

        const _output = {
            a: 'a', e: 'e', i: 'i', o: 'o',  u: 'u',  
            c: 'c', oth: '',
            vc: 'voce', td:'tudo', oq:'o que', pq:'porque' 
        }

        for ( let i in _input ) value = value.toLowerCase().replace( _input[i], _output[i] );
        return value   
    }

}