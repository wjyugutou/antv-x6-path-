<script lang='ts' setup>
import type { ShallowRef } from 'vue'
import { onMounted, shallowRef } from 'vue'

import { Addon, Edge, Graph, ObjectExt, Shape } from '@antv/x6'

import type { Attr } from '@antv/x6/lib/registry/attr'
type Pos = [number, number]

const graph = shallowRef() as ShallowRef<Graph>

function setShapeConfig() {
  Shape.Edge.config({
    attrs: {
      line: {
        sourceMarker: false,
        targetMarker: false,
      },
    },
  })
}

const refStrokeWidth: Attr.Definition = {
  set: (val: string, options) => {
    console.log('------------------------')
    console.log({ val, options })
    const { cell, attrs: { ref } } = options
    const percentage = Number(val.replace('%', '')) / 100
    console.log(ref ? { strokeWidth: cell.attrs![ref as string].strokeWidth } : undefined)
    return ref ? { 'stroke-width': Number(cell.attrs![ref as string].strokeWidth) * percentage } : undefined
  },
}

Graph.registerAttr('refStrokeWidth', refStrokeWidth)

function registerAnimateEdge() {
  Graph.registerEdge('edge-animate', {
    inherit: 'edge',
    markup: [
      {
        tagName: 'path',
        selector: 'wrap',
        groupSelector: 'lines',
        attrs: {
          fill: 'none',
          cursor: 'pointer',
          stroke: 'transparent',
          strokeLinecap: 'round',
        },
      },
      {
        tagName: 'path',
        selector: 'line',
        groupSelector: 'lines',
        attrs: {
          fill: 'none',
          pointerEvents: 'none',
        },
      },
      {
        tagName: 'path',
        selector: 'animateLine',
        groupSelector: 'lines',
        attrs: {
          fill: 'none',
          pointerEvents: 'none',
        },
      },
    ],
    attrs: {
      wrap: { strokeWidth: 10 },
      lines: { connection: true, strokeLinejoin: 'round' },
      line: { stroke: '#333', strokeWidth: 20, targetMarker: false, sourceMarker: false },
      animateLine: {
        ref: 'line',
        stroke: 'red',
        // refWidth: '100%',
        refStrokeWidth: '100%',
        strokeDasharray: '10, 30',
        strokeLinecap: 'round',
        targetMarker: false,
        sourceMarker: false,
        visibility: 'visible',
      },
    },
  }, true)
}

function initGraph() {
  registerAnimateEdge()
  setShapeConfig()
  graph.value = new Graph({
    container: document.getElementById('container')!,
    grid: true,
  })
  graphEvent()
  createRect([100, 100], 'cell-1')
  createRect([500, 100], 'cell-2')
  createEdge()
}

function graphEvent() {
  graph.value.on('edge:click', ({ edge, view }) => {
    console.log(edge)
    edge.setAttrByPath('attrs/animateLine/visibility', 'visible')
    const strokeWidth = edge.getAttrByPath('line/strokeWidth')
    console.log(strokeWidth)
    edge.setAttrByPath('line/strokeWidth', strokeWidth - 1)
    view?.animate('animateLine', {
      attributeName: 'stroke-dashoffset',
      values: '0; 40',
      dur: '500ms',
      repeatCount: 'indefinite',
    })
  })
}

function createRect([x, y]: Pos, id?: string) {
  return graph.value.addNode({
    id,
    x,
    y,
    width: 100,
    height: 100,
    label: 'Rect',
    shape: 'rect',
    ports: {
      groups: {
        top: { position: 'top', attrs: { circle: { magnet: true } } },
        bottom: { position: 'bottom', attrs: { circle: { magnet: true } } },
        left: { position: 'left', attrs: { circle: { magnet: true } } },
        right: { position: 'right', attrs: { circle: { magnet: true } } },
      },
      items: [
        { id: 'port-1', group: 'top' },
        { id: 'port-2', group: 'bottom' },
        { id: 'port-3', group: 'left' },
        { id: 'port-4', group: 'right' },
      ],
    },
  })
}

function createEdge() {
  const edge = graph.value.addEdge({
    shape: 'edge-animate',
    source: { cell: 'cell-1', port: 'port-1' },
    target: { cell: 'cell-2', port: 'port-1' },
  })

  const view = graph.value.findView(edge)

  return edge
}

onMounted(() => {
  initGraph()
})
</script>

<template>
  <div flex>
    <div id="dnd" w-20vw />
    <div id="container" w-80vw h-100vh />
  </div>
</template>

<style scoped>

</style>
