// module.exports = getdate 

// function getdate(){
//     const today = new Date();
//     var options = { weekday: 'long',
//                     year: 'numeric', 
//                     month: 'long', 
//                     day: 'numeric'
//                  };
//     return  today.toLocaleDateString('hi-in', options);
// }



exports.getdate = () => {
    const today = new Date();
    var options = { weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                 };
    return  today.toLocaleDateString('en-in', options);

}



exports.getday= () => {
    const today = new Date();
    var options = { weekday: 'long',};
    return  today.toLocaleDateString('hi-in', options);

}