export const FetchData = {
    async data() {
        var result = [];
        await fetch(''https://gist.githubusercontent.com/dung111999/4bc71dab72d71d411f3454d3efe32e88/raw/c88fb776776b83d0d0cd17706ebb6b61c612c05d/gistfile1.txt'')
            .then((response) => response.json())
            .then((responseJSON) => {
                result = responseJSON
            })
            //console.log(result)
            return result;
    }
}
