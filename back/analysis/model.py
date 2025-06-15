import torch
from models.unet import UNet

def load_model(model_path="unet.pth"):
    model = UNet(in_channels=3, out_channels=1)
    model.load_state_dict(torch.load(model_path, map_location="cpu"))
    model.eval()
    return model
