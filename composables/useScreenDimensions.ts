import { ref, onMounted, onUnmounted } from 'vue'

export default function useScreenDimensions(){
    const height= ref()
    const width= ref()

    function update(e:Event) {
        height.value= document.body.clientHeight
        width.value= document.body.clientWidth
    }

    onMounted(()=>{
        height.value= document.body.clientHeight
        width.value= document.body.clientWidth

        window.addEventListener("resize", update)
    })

    onUnmounted(()=>{
        window.removeEventListener("resize", update)
    })

    return {width, height}
}