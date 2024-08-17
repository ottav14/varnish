
function withinBoundingBox(event, boundingBox) {
	return (
		event.clientX >= boundingBox.left &&
		event.clientX <= boundingBox.right &&
		event.clientY >= boundingBox.top &&
		event.clientY <= boundingBox.bottom
	);
}

export function initializeCameraControls(document, boundingBox) {

		console.log("ran!");
		document.addEventListener('mousedown', function(event) {
            if(withinBoundingBox(event, boundingBox)) {
                console.log('Mouse pressed within the bounding box!');
            }
        });	

}

export function handleCameraControls() {






}
