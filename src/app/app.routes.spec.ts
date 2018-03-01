import { InstagramComponent } from './instagram/instagram.component';
import { appRoutes } from './app.module';
import { LoginComponent } from './login/login.component';
import { EditComponent } from './edit/edit.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WodsComponent } from './wods/wods.component';

describe('routes', () => {
    it('should have contain a route for /instagram', () => {
        expect(appRoutes).toContain({path: 'instagram', component: InstagramComponent});
    });

    it('should have contain a route for /login', () => {
        expect(appRoutes).toContain({path: 'login', component: LoginComponent});
    });

    it('should have contain a route for /edit', () => {
        expect(appRoutes).toContain({path: 'edit', component: EditComponent});
    });

    it('should have contain a route for /reset-password', () => {
        expect(appRoutes).toContain({path: 'reset-password', component: ResetPasswordComponent});
    });

    it('should have contain a route for /dashboard', () => {
        expect(appRoutes).toContain({path: 'dashboard', component: DashboardComponent});
    });

    it('should have contain a route for /wods', () => {
        expect(appRoutes).toContain({path: 'wods', component: WodsComponent});
    });
});