import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { EventDto } from '../src/monitor/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let dbService: DatabaseService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(3333);

    dbService = app.get(DatabaseService);
    await dbService.clearDB();

    pactum.request.setBaseUrl('http://localhost:3333/')

    dbService.clearDB()
  });

  it(`create event for user john via post request - 
      app puts the event in the work queue`, () => {
    const dto: EventDto = {
      type: 'type',
      page: 'page',
      element_id: 'element_id',
      user: 'john',
      timestamp: null
    }
    return pactum.spec()
      .post('api/monitor/events')
      .withBody(dto)
      .expectStatus(201)
      .expectJsonLike({
        type: 'type',
        page: 'page',
        element_id: 'element_id',
        user: 'john',
      })
  })

  it('wait for consumer to pick up the event and then db should have 1 event', async () => {

    await pactum.sleep(100);

    return pactum.spec()
      .get('api/monitor/events/user')
      .expectStatus(200)
      .expectJson([{ "events": 1, "user": "john" }])
  })

  it(`create 9 more events for john - 
      then get events per user should return total 10 events`, async () => {
    for (let i = 0; i < 9; i++) {
      await dbService.createEvent({
        type: 'type',
        page: 'page',
        element_id: 'element_id',
        user: 'john',
        timestamp: new Date()
      })
    }

    return pactum.spec()
      .get('api/monitor/events/user')
      .expectStatus(200)
      .expectJson([{ "events": 10, "user": "john" }])
  })

  it(`clear db, create diferent number of events for 5 users
      then get events per user should be ordered decending`, async () => {
    await dbService.clearDB()

    await createEventsForUser('jim', 25, dbService)
    await createEventsForUser('clod', 5, dbService)
    await createEventsForUser('jack', 30, dbService)
    await createEventsForUser('jill', 20, dbService)
    await createEventsForUser('moshe', 10, dbService)
    await createEventsForUser('suzy', 15, dbService)

    return pactum.spec()
      .get('api/monitor/events/user')
      .expectStatus(200)
      .expectJsonLike([
        { "events": 30, "user": 'jack' },
        { "events": 25, "user": 'jim' },
        { "events": 20, "user": 'jill' },
        { "events": 15, "user": 'suzy' },
        { "events": 10, "user": 'moshe' },
        { "events": 5, "user": 'clod' }
      ])
  })

  it(`we just created 105 events way less the a minute so
      get avg events per minute - should be 105`, async () => {
    return pactum.spec()
      .get('api/monitor/events/avg_epm')
      .expectStatus(200)
      .expectJson({ "avg_epm": 105 })
  })

  it(`cleareDb, create 30 events per minute for 5 differen users
      then get avg epm should return 30`, async () => {

    await dbService.clearDB()

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 30; j++) {
        const timestamp = new Date()
        timestamp.setMinutes(i)
        timestamp.setSeconds(i)
        await dbService.createEvent({
          type: 'type',
          page: 'page',
          element_id: 'element_id',
          user: 'john' + i,
          timestamp: timestamp
        })
      }
    }

    return pactum.spec()
      .get('api/monitor/events/avg_epm')
      .expectStatus(200)
      .expectJson({ "avg_epm": 30 })
  })

  it(`now we should get 30 events per user `, async () => {

    return pactum.spec()
      .get('api/monitor/events/user')
      .expectStatus(200)
      .expectJsonLike([
        { "events": 30, "user": /john[0-4]/ },
        { "events": 30, "user": /john[0-4]/ },
        { "events": 30, "user": /john[0-4]/ },
        { "events": 30, "user": /john[0-4]/ },
        { "events": 30, "user": /john[0-4]/ }
      ])
  })

  it('get users visiting today - should be 5 based on previous test', async () => {
    return pactum.spec()
      .get('api/monitor/user/visits')
      .expectStatus(200)
      .expectJson({ "users_visiting_today": 5 })
  })

  it(`clear db, create events today and events yesterday
      make sure only today's events are counted`, async () => {
    await dbService.clearDB()

    const yesterday = new Date()
    yesterday.setHours(-25)

    await createEventsForUser('jim', 25, dbService, yesterday)
    await createEventsForUser('clod', 5, dbService)
    await createEventsForUser('jack', 30, dbService)

    return pactum.spec()
      .get('api/monitor/user/visits')
      .expectStatus(200)
      .expectJson({ "users_visiting_today": 2 })

  })

  it('events per user should disregard user jim', async () => {
    return pactum.spec()
      .get('api/monitor/events/user')
      .expectStatus(200)
      .expectJsonLike([
        { "events": 30, "user": 'jack' },
        { "events": 5, "user": 'clod' },
      ])
  })

  it('evg epm should be 35 - disregarding jim yesterday', async () => {
    return pactum.spec()
      .get('api/monitor/events/avg_epm')
      .expectStatus(200)
      .expectJson({ "avg_epm": 35 })
  })

  it('clear db, test apis on empty db - edge cases', async () => {
    await dbService.clearDB()
  })

  it('avg epm', async () => {
    return pactum.spec()
      .get('api/monitor/events/avg_epm')
      .expectStatus(200)
      .expectJson({ "avg_epm": 0 })
  })

  it('events per user', async () => {
    return pactum.spec()
      .get('api/monitor/events/user')
      .expectStatus(200)
      .expectJsonLike([])
  })

  it('users visiting today', async () => {
    return pactum.spec()
      .get('api/monitor/user/visits')
      .expectStatus(200)
      .expectJson({ "users_visiting_today": 0 })
  })

  afterAll(() => {
    app.close();
  });


});

async function createEventsForUser(user, numEvent, dbService, timestamp?) {
  for (let i = 0; i < numEvent; i++) {
    await dbService.createEvent({
      type: 'type',
      page: 'page',
      element_id: 'element_id',
      user: user,
      timestamp: timestamp ? timestamp : new Date()
    })
  }
} 