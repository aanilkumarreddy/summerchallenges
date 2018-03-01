import { WodsComponent } from "./wods.component";
import { WodsService } from "./wods.service";

describe('WodsComponent Unit Tests', () => {
    let component: WodsComponent;
    let service: WodsService;
    beforeEach(()=>{
        service = new WodsService(null);
        component = new WodsComponent(service);
    });

    it('should exist the component with this service', () => {
        // Arrange
        // Act
        // Assert
    });
});