class SearchView{
    _parentEl= document.querySelector('.search');
    getQuery(){
        //return this.#parentEl.querySelector('.search_field').value;
        const searchField = this._parentEl.querySelector('.search__field').value;
 
        this._clearInput();
        return searchField;
        
    }
    _clearInput(){
        this._parentEl.querySelector('.search__field').value='';
    }
    addHandlerSearch(handler){
        this._parentEl.addEventListener('submit',function(e){
            e.preventDefault();
            handler();
        });
    }
}
export default new SearchView();