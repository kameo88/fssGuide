// window.addEventListener('load', function() {
// 			var allElements = document.getElementsByTagName('*');
// 			Array.prototype.forEach.call(allElements, function(el) {
// 					var includePath = el.dataset.includePath;
// 					if (includePath) {
// 							var xhttp = new XMLHttpRequest();
// 							xhttp.onreadystatechange = function () {
// 									if (this.readyState == 4 && this.status == 200) {
// 										el.outerHTML = this.responseText;
// 									}
// 							};
// 							xhttp.open('GET', includePath, true);
// 							xhttp.send();
// 					}
// 			});
// });


document.addEventListener("DOMContentLoaded", function () {

    const includes = document.querySelectorAll("[data-include]");

    includes.forEach(el => {
        const file = el.getAttribute("data-include");

        fetch(file)
            .then(res => res.text())
            .then(html => {
                el.innerHTML = html;

                // include 완료 후 이벤트 트리거
                document.dispatchEvent(new Event("include:loaded"));
            })
            .catch(err => {
                console.error("Include Error:", err);
            });
    });

});

