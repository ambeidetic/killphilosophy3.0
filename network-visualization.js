/**
 * Network Visualization for KillPhilosophy
 * Handles D3.js visualizations of academic connections
 */

// Global visualization state
let networkSimulation = null;
let networkSvg = null;
let networkWidth = 0;
let networkHeight = 0;
let networkData = null;
let networkLinks = null;
let networkNodes = null;
let networkLabels = null;

/**
 * Initialize the network visualization container
 */
function initializeNetworkVisualization() {
    console.log('Initializing network visualization');
    
    // Get the container
    const container = document.getElementById('visualization-container');
    if (!container) {
        console.warn('Visualization container not found');
        return;
    }
    
    // Check if D3.js is available
    if (typeof d3 === 'undefined') {
        console.error('D3.js library not loaded');
        container.innerHTML = '<div class="error-message">D3.js library not loaded. Network visualization is unavailable.</div>';
        return;
    }
    
    // Clear any existing visualization
    container.innerHTML = '';
    
    // Create SVG container
    networkWidth = container.clientWidth;
    networkHeight = container.clientHeight;
    
    networkSvg = d3.select(container)
        .append('svg')
        .attr('width', networkWidth)
        .attr('height', networkHeight)
        .attr('tabindex', '0') // Make SVG focusable for keyboard users
        .attr('aria-label', 'Network visualization of academic connections');
    
    // Add marker for arrows on directed links
    networkSvg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10') // Adjusted viewBox for better arrow appearance
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#0f0')
        .style('stroke', 'none');
    
    // Add zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            d3.select('svg g.network-container')
                .attr('transform', event.transform);
        });
    
    networkSvg.call(zoom);
    
    // Create a container for the network
    networkSvg.append('g')
        .attr('class', 'network-container');
    
    // Initialize with empty data
    networkData = { nodes: [], links: [] };
    
    // Add keyboard navigation
    networkSvg.on('keydown', handleNetworkKeydown);
    
    console.log('Network visualization initialized');
}

/**
 * Handle keyboard navigation in the network visualization
 * @param {Event} event - Keyboard event
 */
function handleNetworkKeydown(event) {
    if (!networkNodes || !networkData || networkData.nodes.length === 0) return;
    
    // Find the currently selected node
    const selectedIndex = networkData.nodes.findIndex(d => d.selected);
    let newIndex = selectedIndex;
    
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
            // Move to previous node
            event.preventDefault();
            newIndex = selectedIndex > 0 ? selectedIndex - 1 : networkData.nodes.length - 1;
            break;
        case 'ArrowDown':
        case 'ArrowRight':
            // Move to next node
            event.preventDefault();
            newIndex = selectedIndex < networkData.nodes.length - 1 ? selectedIndex + 1 : 0;
            break;
        case 'Enter':
        case ' ':
            // Select the currently focused node
            event.preventDefault();
            if (selectedIndex >= 0) {
                const node = networkData.nodes[selectedIndex];
                highlightConnections(node);
                
                // Attempt to display academic info if available
                if (typeof displayAcademic === 'function' && typeof databaseManager !== 'undefined') {
                    const academic = databaseManager.getAcademic(node.id);
                    if (academic) {
                        displayAcademic(academic);
                    }
                }
            }
            return;
        default:
            return;
    }
    
    // Update node selection
    if (newIndex !== selectedIndex) {
        // Clear previous selection
        networkData.nodes.forEach(d => d.selected = false);
        
        // Set new selection
        networkData.nodes[newIndex].selected = true;
        
        // Update visual appearance
        networkNodes.attr('stroke', d => d.selected ? '#fff' : 'none')
                   .attr('stroke-width', d => d.selected ? 2 : 0);
        
        // Ensure the selected node is visible
        if (networkSimulation) {
            const node = networkData.nodes[newIndex];
            
            // Center view on the selected node
            const transform = d3.zoomTransform(networkSvg.node());
            const x = transform.invertX(networkWidth / 2) - node.x;
            const y = transform.invertY(networkHeight / 2) - node.y;
            
            networkSvg.transition().duration(500)
                .call(d3.zoom().transform, d3.zoomIdentity
                    .translate(x, y)
                    .scale(transform.k));
        }
    }
}

/**
 * Visualize an academic's connections
 * @param {Object} academic - Academic object
 */
function visualizeAcademic(academic) {
    if (!academic || !academic.name) {
        console.error('Invalid academic data for visualization');
        return;
    }
    
    console.log(`Visualizing network for ${academic.name}`);
    
    // Prepare the data
    const nodes = [];
    const links = [];
    
    // Add the main academic
    nodes.push({
        id: academic.name,
        group: 'main',
        radius: 15
    });
    
    // Process connections if available
    if (academic.connections && academic.connections.length > 0) {
        // Add connection nodes
        academic.connections.forEach(connection => {
            nodes.push({
                id: connection,
                group: 'connection',
                radius: 10
            });
            
            // Add link from main academic to connection
            links.push({
                source: academic.name,
                target: connection,
                value: 1
            });
        });
        
        // If database manager is available, add connections between other academics
        if (typeof databaseManager !== 'undefined') {
            // Check for connections between the connections
            for (let i = 0; i < academic.connections.length; i++) {
                const academicA = databaseManager.getAcademic(academic.connections[i]);
                
                if (academicA && academicA.connections) {
                    for (let j = i + 1; j < academic.connections.length; j++) {
                        const connectionB = academic.connections[j];
                        
                        // Check if academicA is connected to connectionB
                        if (academicA.connections.includes(connectionB)) {
                            // Add link between these connections
                            links.push({
                                source: academic.connections[i],
                                target: connectionB,
                                value: 0.5,
                                dashed: true
                            });
                        }
                    }
                }
            }
        }
    }
    
    // Visualize the network
    visualizeNetwork({ nodes, links }, `Network for ${academic.name}`);
}

/**
 * Visualize a network
 * @param {Object} data - Network data with nodes and links
 * @param {string} title - Visualization title
 */
function visualizeNetwork(data, title = 'Network Visualization') {
    // Validate data
    if (!data || !data.nodes || !data.links) {
        console.error('Invalid network data');
        return;
    }
    
    console.log(`Visualizing network with ${data.nodes.length} nodes and ${data.links.length} links`);
    
    // Make sure the visualization container is initialized
    if (!networkSvg) {
        initializeNetworkVisualization();
        
        if (!networkSvg) {
            console.error('Failed to initialize network visualization');
            return;
        }
    }
    
    // Get the container
    const container = document.getElementById('visualization-container');
    if (!container) {
        console.warn('Visualization container not found');
        return;
    }
    
    // Make the container visible
    container.style.display = 'block';
    
    // Reset zoom
    networkSvg.transition().duration(750).call(
        d3.zoom().transform,
        d3.zoomIdentity
    );
    
    // Update container size in case it has changed
    networkWidth = container.clientWidth;
    networkHeight = container.clientHeight;
    
    networkSvg.attr('width', networkWidth)
              .attr('height', networkHeight);
    
    // Store the data
    networkData = data;
    
    // Add title
    container.querySelector('.visualization-title')?.remove();
    const titleElement = document.createElement('h3');
    titleElement.className = 'visualization-title';
    titleElement.textContent = title;
    container.appendChild(titleElement);
    
    // Add close button if not already present
    if (!container.querySelector('.close-visualization-btn')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'close-visualization-btn';
        closeButton.innerHTML = '×';
        closeButton.title = 'Close visualization';
        closeButton.setAttribute('aria-label', 'Close visualization');
        closeButton.addEventListener('click', () => {
            container.style.display = 'none';
        });
        container.appendChild(closeButton);
    }
    
    // Clear previous visualization
    const networkContainer = networkSvg.select('g.network-container');
    networkContainer.selectAll('*').remove();
    
    // Create a color scale based on node groups
    const color = d3.scaleOrdinal()
        .domain(['main', 'connection', 'related', 'match'])
        .range(['#0f0', '#0a0', '#050', '#0c0']);
    
    // Create links
    networkLinks = networkContainer.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('stroke', '#0a0')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', d => Math.sqrt(d.value) * 2)
        .attr('stroke-dasharray', d => d.dashed ? '5,5' : 'none')
        .attr('class', 'network-link')
        .attr('marker-end', d => d.directed ? 'url(#arrowhead)' : '');
    
    // Create nodes
    networkNodes = networkContainer.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('r', d => d.radius || (d.group === 'main' ? 15 : 10))
        .attr('fill', d => color(d.group))
        .attr('stroke', 'none')
        .attr('class', 'network-node')
        .attr('tabindex', -1) // Make nodes focusable programmatically
        .call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded))
        .on('click', clicked)
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut);
    
    // Add labels to nodes
    networkLabels = networkContainer.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(data.nodes)
        .enter()
        .append('text')
        .text(d => d.id)
        .attr('font-size', '12px')
        .attr('dx', 15)
        .attr('dy', 4)
        .attr('fill', '#0f0')
        .attr('class', 'network-label');
    
    // Create force simulation
    networkSimulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(networkWidth / 2, networkHeight / 2))
        .force('collision', d3.forceCollide().radius(d => (d.radius || 10) + 5))
        .on('tick', ticked);
    
    // Add legend
    addNetworkLegend(networkContainer, color);
    
    console.log('Network visualization created');
}

/**
 * Add a legend to the network visualization
 * @param {Object} container - D3 selection of the container
 * @param {Function} colorScale - D3 color scale function
 */
function addNetworkLegend(container, colorScale) {
    const legend = container.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(20, 20)');
    
    const legendItems = [
        { text: 'Main Academic', group: 'main' },
        { text: 'Direct Connection', group: 'connection' },
        { text: 'Related Academic', group: 'related' },
        { text: 'Search Match', group: 'match' }
    ];
    
    // Add legend items
    legendItems.forEach((item, i) => {
        const legendItem = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);
        
        legendItem.append('circle')
            .attr('r', 6)
            .attr('fill', colorScale(item.group));
        
        legendItem.append('text')
            .attr('x', 15)
            .attr('y', 4)
            .attr('font-size', '12px')
            .attr('fill', '#0f0')
            .text(item.text);
    });
    
    // Add background to make legend more readable
    const bbox = legend.node().getBBox();
    legend.insert('rect', ':first-child')
        .attr('x', bbox.x - 5)
        .attr('y', bbox.y - 5)
        .attr('width', bbox.width + 10)
        .attr('height', bbox.height + 10)
        .attr('fill', 'rgba(0, 0, 0, 0.7)')
        .attr('rx', 5)
        .attr('ry', 5);
}

/**
 * Handle force-directed layout ticks
 */
function ticked() {
    // Update link positions
    networkLinks
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    
    // Update node positions with boundary constraints
    networkNodes
        .attr('cx', d => {
            return d.x = Math.max(d.radius || 10, Math.min(networkWidth - (d.radius || 10), d.x));
        })
        .attr('cy', d => {
            return d.y = Math.max(d.radius || 10, Math.min(networkHeight - (d.radius || 10), d.y));
        });
    
    // Update label positions
    networkLabels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
}

/**
 * Handle click on node
 * @param {Event} event - Click event
 * @param {Object} d - Node data
 */
function clicked(event, d) {
    // Prevent event bubbling
    event.stopPropagation();
    
    console.log(`Node clicked: ${d.id}`);
    
    // Highlight connections
    highlightConnections(d);
    
    // Attempt to display academic info if available
    if (typeof displayAcademic === 'function' && typeof databaseManager !== 'undefined') {
        const academic = databaseManager.getAcademic(d.id);
        if (academic) {
            displayAcademic(academic);
        }
    }
    
    // Fix the node position
    d.fx = d.x;
    d.fy = d.y;
    
    // Clear the fixed position after a delay to allow movement again
    setTimeout(() => {
        d.fx = null;
        d.fy = null;
    }, 3000);
}

/**
 * Highlight connections for a node
 * @param {Object} node - Node data
 */
function highlightConnections(node) {
    if (!networkLinks || !networkNodes || !networkLabels) return;
    
    console.log(`Highlighting connections for ${node.id}`);
    
    // Reset all node and link appearances
    networkNodes.attr('opacity', 1);
    networkLinks.attr('stroke-opacity', 0.6);
    networkLabels.attr('opacity', 1);
    
    // Get connected nodes
    const connectedNodeIds = new Set();
    
    // Add the selected node
    connectedNodeIds.add(node.id);
    
    // Add directly connected nodes
    networkLinks.each(function(d) {
        if (d.source.id === node.id) {
            connectedNodeIds.add(d.target.id);
        } else if (d.target.id === node.id) {
            connectedNodeIds.add(d.source.id);
        }
    });
    
    // Highlight nodes and links
    networkNodes.attr('opacity', d => connectedNodeIds.has(d.id) ? 1 : 0.2);
    
    networkLinks.attr('stroke-opacity', d => 
        (d.source.id === node.id || d.target.id === node.id) ? 1 : 0.1
    );
    
    networkLabels.attr('opacity', d => connectedNodeIds.has(d.id) ? 1 : 0.2);
}

/**
 * Handle mouse over on node
 * @param {Event} event - Mouse event
 * @param {Object} d - Node data
 */
function mouseOver(event, d) {
    // Highlight node and its connections
    d3.select(this)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);
    
    // Show tooltip
    showTooltip(event, d);
}

/**
 * Handle mouse out on node
 * @param {Event} event - Mouse event
 * @param {Object} d - Node data
 */
function mouseOut(event, d) {
    // Reset node appearance
    d3.select(this)
        .attr('stroke', d.selected ? '#fff' : 'none')
        .attr('stroke-width', d.selected ? 2 : 0);
    
    // Hide tooltip
    hideTooltip();
}

/**
 * Show tooltip
 * @param {Event} event - Mouse event
 * @param {Object} d - Node data
 */
function showTooltip(event, d) {
    // Check if a tooltip already exists
    let tooltip = document.getElementById('network-tooltip');
    
    // Create tooltip if it doesn't exist
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'network-tooltip';
        tooltip.className = 'network-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background-color: rgba(0, 20, 0, 0.9);
            border: 1px solid #0f0;
            border-radius: 4px;
            padding: 8px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 1000;
            color: #0f0;
        `;
        document.body.appendChild(tooltip);
    }
    
    // Get academic information if available
    let tooltipContent = `<div><strong>${d.id}</strong></div>`;
    
    if (typeof databaseManager !== 'undefined') {
        const academic = databaseManager.getAcademic(d.id);
        if (academic) {
            tooltipContent += `<div>Group: ${d.group}</div>`;
            
            if (academic.taxonomies && academic.taxonomies.discipline) {
                tooltipContent += `<div>Discipline: ${academic.taxonomies.discipline.join(', ')}</div>`;
            }
            
            if (academic.connections) {
                tooltipContent += `<div>Connections: ${academic.connections.length}</div>`;
            }
        }
    }
    
    // Set tooltip content
    tooltip.innerHTML = tooltipContent;
    
    // Position tooltip near the cursor
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
    
    // Show tooltip
    tooltip.style.opacity = '1';
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    const tooltip = document.getElementById('network-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
}

/**
 * Handle drag start
 * @param {Event} event - Drag event
 * @param {Object} d - Node data
 */
function dragStarted(event, d) {
    if (!networkSimulation) return;
    
    if (!event.active) networkSimulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

/**
 * Handle drag move
 * @param {Event} event - Drag event
 * @param {Object} d - Node data
 */
function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

/**
 * Handle drag end
 * @param {Event} event - Drag event
 * @param {Object} d - Node data
 */
function dragEnded(event, d) {
    if (!networkSimulation) return;
    
    if (!event.active) networkSimulation.alphaTarget(0);
    
    // Only remove fixed position if not selected
    if (!d.fixed) {
        d.fx = null;
        d.fy = null;
    }
}

// Make functions globally available
window.initializeNetworkVisualization = initializeNetworkVisualization;
window.visualizeAcademic = visualizeAcademic;
window.visualizeNetwork = visualizeNetwork;
