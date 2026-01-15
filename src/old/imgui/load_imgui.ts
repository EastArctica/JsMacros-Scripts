const ImGui = Java.type('imgui.ImGui') as any;
const ImGuiImplGl3 = Java.type('imgui.gl3.ImGuiImplGl3') as any;
const ImGuiImplGlfw = Java.type('imgui.glfw.ImGuiImplGlfw') as any;
const ImGuiConfigFlags = Java.type('imgui.flag.ImGuiConfigFlags') as any;
const ImGuiCol = Java.type('imgui.flag.ImGuiCol') as any;
const ImFontConfig = Java.type('imgui.ImFontConfig') as any;

const imguiGlfw = new ImGuiImplGlfw();
const imguiGl3 = new ImGuiImplGl3();
const glslVersion: string = '#version 150';

const mcHandle: number = Client.getMinecraft().method_22683().method_4490();
function onGlfwInit(handle: number) {
    initImGui();
    imguiGlfw.init(handle, true);
    imguiGl3.init(glslVersion);
}

function initImGui() {
    ImGui.createContext();

    const io = ImGui.getIO();
    // Not sure how to do this
    io.setIniFilename(null);
    io.addConfigFlags(ImGuiConfigFlags.NavEnableKeyboard);
    io.addConfigFlags(ImGuiConfigFlags.DockingEnable);
    io.addConfigFlags(ImGuiConfigFlags.ViewportsEnable);
    io.setConfigViewportsNoTaskBarIcon(true);

    const fontAtlas = io.getFonts();
    const fontConfig = new ImFontConfig();

    fontConfig.setGlyphRanges(fontAtlas.getGlyphRangesDefault())
    fontAtlas.addFontDefault(fontConfig);

    fontConfig.setMergeMode(true);
    fontConfig.setPixelSnapH(true);

    fontConfig.destroy();

    if (io.hasConfigFlags(ImGuiConfigFlags.ViewportsEnable)) {
        const style = ImGui.getStyle();
        style.setWindowRounding(0);
        // style.setColor(ImGuiCol.WindowBg, ImGui.GetColorU32(ImGuiCol.WindowBg, 1));
    }
}

function endFrame(handle: number) {
    imguiGl3.renderDrawData(ImGui.getDrawData());

    if (ImGui.getIO().hasConfigFlags(ImGuiConfigFlags.ViewportsEnable)) {
        const backup = ImGui.getDrawData();
        ImGui.updatePlatformWindows();
        ImGui.renderPlatformWindowsDefault(backup, handle);
    }
}

function onFrameRender() {
    imguiGlfw.newFrame();
    ImGui.newFrame();

    // render boyo
    ImGui.begin('Hello, world!');
    ImGui.text('This is some useful text.');
    if (ImGui.button('Button')) {
        Chat.log('Button clicked');
    }
    ImGui.end();

    ImGui.render();
    endFrame(mcHandle);
}

// Get window handle
Client.runOnMainThread(JavaWrapper.methodToJava(() => onGlfwInit(mcHandle)))

// const draw3d = Reflection.createClassProxyBuilder(Java.type('xyz.wagyourtail.jsmacros.client.api.classes.render.Draw3D') as any)
//             .addMethod('render', JavaWrapper.methodToJava((ref: any, args) => {
//     draw3d.clear();
//     onFrameRender();
//     ref.parent(args);
// })).buildInstance([]) as any;
// draw3d.register()

Chat.log('ImGui loaded!');


GlobalVars.putObject('imgui-on-frame-render', JavaWrapper.methodToJava(onFrameRender));

Java.addToClasspath("byte-buddy-agent-1.15.11.jar")
const instrumentation = (Java.type("net.bytebuddy.agent.ByteBuddyAgent") as any).install()
const ctClass = Java.type("javassist.ClassPool").getDefault().get("com.mojang.blaze3d.systems.RenderSystem")
ctClass.stopPruning(true)
if (ctClass.isFrozen()) ctClass.defrost()
const ctMethod = ctClass.getDeclaredMethod("flipFrame").setBody(`{ pollEvents(); }`)
instrumentation.redefineClasses(new (java.lang as any).instrument.ClassDefinition(Reflection.getClass(ctClass.getName()), ctClass.toBytecode()))

// Java.addToClasspath("byte-buddy-agent-1.15.11.jar")
// const instrumentation = Java.type("net.bytebuddy.agent.ByteBuddyAgent").install()
// const ctClass = Java.type("javassist.ClassPool").getDefault().get("net.minecraft.class_634")
// ctClass.stopPruning(true)
// if (ctClass.isFrozen()) ctClass.defrost()
// ctClass.getDeclaredMethod("method_46529").setBody(`{ return true; }`)
// instrumentation.redefineClasses(new java.lang.instrument.ClassDefinition(Reflection.getClass(ctClass.getName()), ctClass.toBytecode()))


