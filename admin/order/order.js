const viewBtn = document.querySelectorAll('.view-btn');
viewBtn.forEach(button => {
    button.addEventListener('click',function(){
        window.location.href ='../order/detail.html';
    });
});


