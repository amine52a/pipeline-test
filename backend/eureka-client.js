import { Eureka } from 'eureka-js-client';

// Skip Eureka in production (Render/cloud deployment)
const isProduction = process.env.NODE_ENV === 'production' || process.env.SKIP_EUREKA === 'true';

let eurekaClient;

if (isProduction) {
  console.log('⏭️  Eureka registration skipped (production mode)');
  eurekaClient = { start: (cb) => cb && cb(), stop: () => {} };
} else {
  eurekaClient = new Eureka({
    instance: {
      app: 'backend-service',
      hostName: process.env.HOSTNAME || 'localhost',
      ipAddr: '127.0.0.1',
      port: {
        '$': parseInt(process.env.PORT) || 9090,
        '@enabled': true,
      },
      vipAddress: 'backend-service',
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
    },
    eureka: {
      host: process.env.EUREKA_HOST || 'localhost',
      port: parseInt(process.env.EUREKA_PORT) || 8761,
      servicePath: '/eureka/apps/',
    },
  });

  eurekaClient.start((error) => {
    if (error) {
      console.error('❌ Eureka registration failed:', error);
    } else {
      console.log('✅ Successfully registered with Eureka Server');
    }
  });
}

export default eurekaClient;
