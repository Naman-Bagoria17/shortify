import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, containerId = 'modal-root' }) => {
    const [container, setContainer] = useState(null);

    useEffect(() => {
        // Create or get the portal container
        let portalContainer = document.getElementById(containerId);
        
        if (!portalContainer) {
            portalContainer = document.createElement('div');
            portalContainer.id = containerId;
            portalContainer.className = 'modal-container';
            document.body.appendChild(portalContainer);
        }

        setContainer(portalContainer);

        // Cleanup function
        return () => {
            // Only remove if it's empty and we created it
            if (portalContainer && portalContainer.children.length === 0 && portalContainer.id === containerId) {
                document.body.removeChild(portalContainer);
            }
        };
    }, [containerId]);

    // Render children into the portal container
    return container ? createPortal(children, container) : null;
};

export default Portal;
