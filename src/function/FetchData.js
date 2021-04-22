export const FetchData = {
    async data() {
        var result = [];
        await fetch('https://gist.githubusercontent.com/dung111999/4bc71dab72d71d411f3454d3efe32e88/raw/a569511fb0e7ed362f4a4b3201ddd545e1a7d6a8/gistfile1.txt')
            .then((response) => response.json())
            .then((responseJSON) => {
                result = responseJSON
            })
            //console.log(result)
            return result;
    }
}
