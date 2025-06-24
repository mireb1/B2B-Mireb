const Message = require('../models/Message');
const Activity = require('../models/Activity');

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des messages', error: error.message });
  }
};

// Get single message
exports.getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du message', error: error.message });
  }
};

// Create new message
exports.createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const newMessage = new Message({
      name,
      email,
      subject,
      message
    });
    
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message', error: error.message });
  }
};

// Update message status
exports.updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    message.status = status;
    const updatedMessage = await message.save();
    
    // Log activity
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Mise à jour de statut de message',
        details: `Message: ${message._id}, Nouveau statut: ${status}`,
        ipAddress: req.ip
      });
      await activity.save();
    }
    
    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du message', error: error.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    await message.deleteOne();
    
    // Log activity
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Suppression de message',
        details: `Message de: ${message.name}`,
        ipAddress: req.ip
      });
      await activity.save();
    }
    
    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du message', error: error.message });
  }
};
