import * as request from 'supertest';
import { AboutModule } from '../../../src/modules/about.module';
import { GetUserDataDto } from '../../../src/modules/about/about.dto';
import { INestApplication } from '@nestjs/common';
import { initApp } from '../../util';

describe('AboutController', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await initApp({
            imports: [AboutModule],
        });
    });

    it('/GET /api/about/github/user-profile/:username 200', async () => {
        return request(app.getHttpServer())
            .get('/api/about/github/user-profile/bs32g1038')
            .then(response => {
                if (response.status === 200) {
                    const res: GetUserDataDto = response.body;
                    expect(res.userInfo.url).toEqual('https://api.github.com/users/bs32g1038');
                    expect(res.userRepos[0].name).toEqual('node-blog');
                    expect(res.userCommits.contribution.length).toBeGreaterThanOrEqual(1);
                }
                if (response.status === 408) {
                    expect(response.body).toEqual({ statusCode: 408, error: 'Request Timeout', message: '请求超时！' });
                }
            })
            .catch(err => {
                expect(1).toEqual(1);
            });
    });

    it('/GET /api/about/github/user-profile/:username 404', async () => {
        return request(app.getHttpServer())
            .get('/api/about/github/user-profile')
            .expect(404);
    });

    afterAll(async () => {
        await app.close();
    });
});
