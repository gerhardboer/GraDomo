(function (angular) {

    angular.module('GraDomo')
        .directive('stream', function () {
            var imageNr = 0; // Serial number of current image
            var finished = []; // References to img objects which have finished downloading
            var paused = false;

            var url,
                streamElement;
            return {
                restrict: 'E',
                scope: {
                    url: '@'
                },
                link: function (scope, element, attrs) {
                    url = attrs.url;
                    streamElement = element[0];
                    createImageLayer(element[0]);
                }
            };

            function createImageLayer() {
                var img = new Image();
                img.style.position = "absolute";
                img.style.zIndex = -1;
                //img.style['margin-left'] = '-250px';
                img.style.width = '100%';
                img.style['vertical-align'] = 'middle';
                img.onload = imageOnload;
                //img.onclick = imageOnclick;
                img.src = url + "&n=" + (++imageNr);
                img.classList.add('img-flip-correction');
                streamElement.insertBefore(img, streamElement.firstChild);
            }

// Two layers are always present (except at the very beginning), to avoid flicker
            function imageOnload() {
                this.style.zIndex = imageNr; // Image finished, bring to front!
                while (1 < finished.length) {
                    var del = finished.shift(); // Delete old image(s) from document
                    del.parentNode.removeChild(del);
                }
                finished.push(this);
                if (!paused) createImageLayer();
            }

            function imageOnclick() { // Clicking on the image will pause the stream
                paused = !paused;
                if (!paused) createImageLayer();
            }

        })
})(angular);
