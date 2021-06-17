/** WebGLObject */
type WebGLObject = uknown;

/** WebGL or WebGL2 rendering context */
type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;

/** Shader stage type */
type WebGLShaderType = WebGL2RenderingContext["VERTEX_SHADER"] | WebGL2RenderingContext["FRAGMENT_SHADER"];

/** Error handler function */
type ErrorHandler = (error: string) => unknown;
