import { deleteUser } from "~~/server/services/userServices.js";

export default defineEventHandler(async (event) => {

    try {
            const { id } = event.context.params
    const deletedUser = await deleteUser(id)

    return { message: 'Usuario eliminado correctamente', user: deletedUser }
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Error al eliminar el usuario', data: error.message })
    }

})