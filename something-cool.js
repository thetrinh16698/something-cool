function enableDynamicHoverInspect() {
    let previousElement = null;

    // Helper function to find element data by builder-id
    function findElementDataById(data, builderId) {
        // Helper function to recursively search through nested objects
        function searchObject(obj) {
            if (!obj || typeof obj !== 'object') return null;

            // Check if current object has matching id
            if (obj.id === builderId) {
                return obj;
            }

            // Search in arrays
            if (Array.isArray(obj)) {
                for (let item of obj) {
                    const result = searchObject(item);
                    if (result) return result;
                }
            } else {
                // Search in object properties
                for (let key in obj) {
                    const result = searchObject(obj[key]);
                    if (result) return result;
                }
            }

            return null;
        }

        return searchObject(data);
    }

    // Function to add hover effect
    function addHighlight(event) {
        const element = document.elementFromPoint(event.clientX, event.clientY);

        if (previousElement && previousElement !== element) {
            previousElement.style.outline = '';
        }

        if (element && element !== previousElement) {
            element.style.outline = '2px solid red';
            previousElement = element;

            const builderId = element.getAttribute('builder-id');
            if (builderId) {
                console.log('Hovered Element Builder ID:', builderId);

                // Find and log the element data
                const elementData = findElementDataById(window.UPEZ_BUILDER_DATA['8c22b490d74c4be8840ebf9c8add7012'][0].data.blocks, builderId);
                if (elementData) {
                    const relevantData = {
                        id: elementData.id,
                        type: elementData['@type'],
                        layerName: elementData.layerName,
                        component: elementData.component,
                        bindings: elementData.bindings,
                        properties: elementData.properties,
                        responsiveStyles: elementData.responsiveStyles,
                        actions: elementData.actions,
                        meta: elementData.meta
                    };

                    // Filter out undefined properties
                    Object.keys(relevantData).forEach(key =>
                        relevantData[key] === undefined && delete relevantData[key]
                    );

                    console.log('Element Data:', relevantData);
                }
            }
        }
    }

    // Remove highlight when mouse leaves the element
    function removeHighlight(event) {
        if (previousElement && !previousElement.contains(event.relatedTarget)) {
            previousElement.style.outline = '';
        }
    }

    // Event listeners for mouse movements
    document.addEventListener('mousemove', addHighlight);
    document.addEventListener('mouseout', removeHighlight);
}

// Execute the function
enableDynamicHoverInspect();