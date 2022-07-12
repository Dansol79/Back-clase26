const Message = require('./chatMongoSchema');

class ChatController{
    constructor(){

    }
    async listAll(){
        try{
            return  await Message.find({});
            
        }catch(error){
            console.log(error);
            throw new Error(`No se pudo listar los mensajes: ${error}`);
        }
    }
    async save(newElement){
        try{
            return await Message.create(newElement);
        }catch(error){
            console.log(error);
            throw new Error(`No se pudo guardar el mensaje: ${error}`);
        }
    }
    async listById(id){
        try{
            return await Message.findById(id);
        }catch(error){
            console.log(error);
            throw new Error(`No se pudo encontrar el mensaje: ${error}`);
        }
    }
    async update(id, data){
        try{
            return await Message.findByIdAndUpdate(id, data);
        }catch(error){
            console.log(error);
            throw new Error(`No se pudo actualizar el mensaje: ${error}`);
        }
    }

    async delete(id){
        try{
            return await Message.findByIdAndDelete(id);
        }catch(error){
            console.log(error);
            throw new Error(`No se pudo eliminar el mensaje: ${error}`);
        }
    }
}

const chatController = new ChatController();
module.exports = chatController;