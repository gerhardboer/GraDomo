(function (angular) {

    angular.module('GraDomo')
        .directive('stream', function () {
            var imageNr = 0; // Serial number of current image
            var finished = []; // References to img objects which have finished downloading
            var paused = false;
            var $scope;

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
                    $scope = scope;

                    createImageLayer();
                }
            };

            function createImageLayer() {
                var img = new Image();
                img.classList.add('video-stream-img');
                img.onload = imageOnload;
                img.onclick = imageOnclick;
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
                if (!paused) {
                    createImageLayer();
                    $scope.$emit('video-started');
                } else {
                    $scope.$emit('video-paused');
                }
            }

        })
})(angular);
