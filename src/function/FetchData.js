export const FetchData = {
    async data() {
        var result = [];
        await fetch('https://gist.githubusercontent.com/dung111999/4bc71dab72d71d411f3454d3efe32e88/raw/0feb1d516f012d681c78e57ca5e99715adc73284/gistfile1.txt')
            .then((response) => response.json())
            .then((responseJSON) => {
                result = responseJSON
            })
            //console.log(result)
            return result;
    }
}
