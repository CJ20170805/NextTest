<template>
    <div class="results-map">
        <svg width="1200" height="1000" viewBox="0 0 1200 1000">
            <g class="container" transform="translate(600,500)">
                <!-- Background layers -->
                <g class="layers">
                    <circle class="layer process" r="400" />
                    <circle class="layer results" r="300" />
                    <circle class="layer outcomes" r="200" />
                    <circle class="layer core" r="100" />
                </g>

                <!-- Section dividers -->
                <g class="dividers">
                    <line x1="0" y1="-400" x2="0" y2="400" />
                    <line x1="-400" y1="0" x2="400" y2="0" />
                    <line x1="-282" y1="-282" x2="282" y2="282" />
                    <line x1="282" y1="-282" x2="-282" y2="282" />
                </g>

                <!-- Section Labels -->
                <g class="labels">
                    <text x="0" y="-350" class="section-label">community education process</text>
                    <text x="-350" y="0" class="section-label">urban emergency</text>
                    <text x="350" y="0" class="section-label">building inspection</text>
                    <text x="0" y="350" class="section-label">recruitment process</text>
                </g>

                <!-- Links will be added here -->
                <g class="links"></g>
                <!-- Nodes will be added here -->
                <g class="nodes"></g>
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as d3 from 'd3'

interface Node {
    id: string
    label: string
    layer: 'core' | 'outcomes' | 'results' | 'process'
    section: 'community-education' | 'emergency-response' | 'building-inspection' | 'training' | 'procurement' | 'recruitment'
    connections: Array<{
        target: string,
        type: 'cause-effect' | 'companion' | 'conflict'
    }>
}

const nodes: Node[] = [
    // Pink layer (core) - mission and vision results
    {
        id: 'less-injury',
        label: 'less injury from fire incidents',
        layer: 'core',
        section: 'emergency-response',
        connections: []
    },
    {
        id: 'reduced-loss',
        label: 'reduced loss from fire incidents',
        layer: 'core',
        section: 'emergency-response',
        connections: []
    },

    // Green layer - strategic results
    {
        id: 'fires-prevented',
        label: 'fires are prevented',
        layer: 'outcomes',
        section: 'emergency-response',
        connections: [
            { target: 'less-injury', type: 'cause-effect' },
            { target: 'reduced-loss', type: 'cause-effect' }
        ]
    },

    // Blue layer - process results
    {
        id: 'fire-smart',
        label: 'the community is "fire smart"',
        layer: 'results',
        section: 'community-education',
        connections: [
            { target: 'fires-prevented', type: 'cause-effect' }
        ]
    },
    {
        id: 'evacuation-plans',
        label: 'all homes have evacuation plans',
        layer: 'results',
        section: 'community-education',
        connections: [
            { target: 'fire-smart', type: 'cause-effect' }
        ]
    },

    // Orange layer - operational results
    {
        id: 'safety-messages',
        label: 'our safety messages are understood by the community',
        layer: 'process',
        section: 'community-education',
        connections: [
            { target: 'evacuation-plans', type: 'cause-effect' }
        ]
    }
]

// Helper function to generate links from node connections
function generateLinks() {
    const links: any[] = []
    nodes.forEach(source => {
        source.connections.forEach(conn => {
            const target = nodes.find(n => n.id === conn.target)
            if (target) {
                links.push({
                    source,
                    target,
                    type: conn.type
                })
            }
        })
    })
    return links
}

// Helper function to create curved link paths
function createLinkPath(d: any) {
    const dx = d.target.x - d.source.x
    const dy = d.target.y - d.source.y
    const dr = Math.sqrt(dx * dx + dy * dy) * 2 // Curve factor
    return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
}

// Helper function to calculate position in layer track
function getLayerRadius(layer: string) {
    switch (layer) {
        case 'core': return 100
        case 'outcomes': return 200
        case 'results': return 300
        case 'process': return 400
        default: return 0
    }
}

// Helper function to get section angle range
function getSectionAngles(section: string) {
    const sectionMap: { [key: string]: { start: number; end: number } } = {
        'community-education': { start: -30, end: 30 },
        'emergency-response': { start: 30, end: 90 },
        'building-inspection': { start: 90, end: 150 },
        'training': { start: 150, end: 210 },
        'procurement': { start: 210, end: 270 },
        'recruitment': { start: 270, end: 330 }
    }
    return sectionMap[section] || { start: 0, end: 0 }
}

// Initialize nodes with proper positions
function initializeNodePositions(nodes: Node[]) {
    return nodes.map(node => {
        const radius = getLayerRadius(node.layer)
        const angles = getSectionAngles(node.section)
        const midAngle = ((angles.start + angles.end) / 2) * Math.PI / 180

        return {
            ...node,
            // Initialize positions relative to 0,0
            x: radius * Math.cos(midAngle),
            y: radius * Math.sin(midAngle)
        }
    })
}

onMounted(() => {
    const width = 1200
    const height = 1000

    const svg = d3.select('.results-map svg')
    const container = svg.select('.container')
    const nodesGroup = container.select('.nodes')
    const linksGroup = container.select('.links')

    // Initialize nodes
    const initializedNodes = initializeNodePositions(nodes)

    // Add nodes first (so they appear above links)
    const nodeGroups = nodesGroup
        .selectAll('.node')
        .data(initializedNodes)
        .join('g')
        .attr('class', d => `node ${d.layer}`)
        .attr('transform', d => `translate(${d.x},${d.y})`)

    // Add circles
    nodeGroups.append('circle')
        .attr('r', 40)
        .attr('class', d => d.layer)

    // Add text
    nodeGroups.append('text')
        .attr('class', 'node-label')
        .attr('dy', '0.35em')
        .text(d => d.label)
        .call(wrap, 70)

    // Add links
    const links = linksGroup
        .selectAll('path')
        .data(generateLinks())
        .join('path')
        .attr('class', d => `link ${d.type}`)

    // Update simulation
    const simulation = d3.forceSimulation(initializedNodes as any)
        .force('radial', d3.forceRadial(
            d => getLayerRadius(d.layer),
            0, 0
        ).strength(1))
        .force('collide', d3.forceCollide(45))
        .force('angular', alpha => {
            initializedNodes.forEach(d => {
                const angles = getSectionAngles(d.section)
                const radius = getLayerRadius(d.layer)
                const angle = (Math.atan2(d.y, d.x) * 180 / Math.PI + 360) % 360
                const startAngle = (angles.start + 90 + 360) % 360
                const endAngle = (angles.end + 90 + 360) % 360

                if (angle < startAngle || angle > endAngle) {
                    const targetAngle = (startAngle + endAngle) / 2 * Math.PI / 180
                    d.x = radius * Math.cos(targetAngle)
                    d.y = radius * Math.sin(targetAngle)
                }

                const currentRadius = Math.sqrt(d.x * d.x + d.y * d.y)
                const scale = radius / currentRadius
                d.x *= scale
                d.y *= scale
            })
        })

    simulation.on('tick', () => {
        nodeGroups.attr('transform', d => `translate(${d.x},${d.y})`)
        links.attr('d', createLinkPath)
    })
})

// Improved text wrapping function
function wrap(text: d3.Selection<any, any, any, any>, width: number) {
    text.each(function () {
        const text = d3.select(this)
        const words = text.text().split(/\s+/).reverse()
        const lineHeight = 1.1
        let line: string[] = []
        let lineNumber = 0
        let word
        let tspan = text.text(null).append('tspan')
            .attr('x', 0)
            .attr('dy', 0)
            .attr('text-anchor', 'middle')

        while (word = words.pop()) {
            line.push(word)
            tspan.text(line.join(' '))
            if (tspan.node()?.getComputedTextLength()! > width) {
                line.pop()
                tspan.text(line.join(' '))
                line = [word]
                tspan = text.append('tspan')
                    .attr('x', 0)
                    .attr('dy', `${lineHeight}em`)
                    .attr('text-anchor', 'middle')
                    .text(word)
                lineNumber++
            }
        }

        // Center the text block vertically
        const height = (lineNumber * lineHeight)
        text.selectAll('tspan')
            .attr('y', -height / 2)
    })
}
</script>

<style scoped>
.results-map {
    width: 100%;
    height: 100vh;
    /* Set explicit height */
    min-height: 1000px;
}

.results-map svg {
    width: 100%;
    height: 100%;
}

.layer {
    stroke: #ccc;
    stroke-width: 1px;
}

.layers .layer.process {
    fill: #fdf2e5;
    /* Light orange - outermost */
    fill-opacity: 1;
    stroke: #ccc;
    stroke-width: 1px;
}

.layers .layer.results {
    fill: #e6f4fe;
    /* Light blue */
    fill-opacity: 1;
    stroke: #ccc;
    stroke-width: 1px;
}

.layers .layer.outcomes {
    fill: #ddefe2;
    /* Light green */
    fill-opacity: 1;
    stroke: #ccc;
    stroke-width: 1px;
}

.layers .layer.core {
    fill: #fceafe;
    /* Light pink - innermost */
    fill-opacity: 1;
    stroke: #ccc;
    stroke-width: 1px;
}

.dividers line {
    stroke: #ccc;
    stroke-width: 1px;
    stroke-dasharray: 4, 4;
}

.node {
    cursor: pointer;
}

.node-label {
    font-size: 11px;
    font-family: Arial, sans-serif;
    fill: #333;
    font-weight: 500;
    pointer-events: none;
    /* Prevent text from interfering with drag */
}

.section-label {
    font-size: 14px;
    font-weight: bold;
    text-anchor: middle;
    fill: #666;
}

.link {
    fill: none;
    stroke: #999;
    stroke-width: 1.5px;
    pointer-events: none;
}

.node circle {
    fill: white;
    stroke-width: 2px;
}

.node.core circle {
    fill: white;
    stroke: #ec407a;
    stroke-width: 2px;
}

.node.outcomes circle {
    fill: white;
    stroke: #4caf50;
    stroke-width: 2px;
}

.node.results circle {
    fill: white;
    stroke: #2196f3;
    stroke-width: 2px;
}

.node.process circle {
    fill: white;
    stroke: #ff9800;
    stroke-width: 2px;
}

.link {
    fill: none;
    stroke: #999;
    stroke-width: 1.5px;
}

.link.cause-effect {
    stroke: #666;
    stroke-width: 2px;
}

.link.companion {
    stroke: #666;
    stroke-width: 2px;
    stroke-dasharray: 4, 4;
}

.link.conflict {
    stroke: #666;
    stroke-width: 2px;
    stroke-dasharray: 2, 2;
}
</style>