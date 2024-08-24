import vine from "@vinejs/vine";


export const registerSchema = vine.object({
    ward_id:vine.number().min(1).max(100),
    email:vine.string().email(),
    username:vine.string(),
    password:vine.string().minLength(6).maxLength(20).confirmed(),
})

export const loginSchema = vine.object({
    email:vine.string().email(),
    password:vine.string().minLength(6).maxLength(20),
})

export const adminloginSchema = vine.object({
    user_id:vine.number(),
    ward_id:vine.number(),
    role:vine.string()
})