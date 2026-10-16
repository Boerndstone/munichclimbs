# Mobile performance baseline

Measured 2026-10-14 with Lighthouse 12.8.2 using its simulated mobile profile and the `performance` category only. Each route was loaded once from the local Symfony baseline (`127.0.0.1:8080`) and once from the local Next preview (`127.0.0.1:3000`) in the same environment. These are comparison measurements, not production RUM values.

| Route | Implementation | Performance | FCP | LCP | CLS | TBT | Transfer | JavaScript |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | Symfony | 39 | 13.1 s | 16.9 s | 0.309 | 120 ms | 3,710 KB | 1,193 KB |
| `/` | Next | 75 | 1.2 s | 10.7 s | 0.000 | 45 ms | 1,897 KB | 876 KB |
| `/Konstein` | Symfony | 53 | 13.0 s | 19.0 s | 0.013 | 162 ms | 3,167 KB | 1,206 KB |
| `/konstein` | Next | 75 | 1.1 s | 10.7 s | 0.000 | 44 ms | 1,915 KB | 885 KB |
| `/Konstein/Burgstein` | Symfony | 55 | 9.5 s | 16.3 s | 0.000 | 103 ms | 2,519 KB | 1,250 KB |
| `/konstein/burgstein` | Next | 73 | 1.1 s | 10.8 s | 0.000 | 42 ms | 1,932 KB | 899 KB |

The Next implementation has no material regression on the measured mobile routes. It reduces transferred JavaScript by roughly 26–28%, total transferred bytes by roughly 23–49%, and has a lower LCP on every representative route. Production monitoring should still establish real-user Web Vitals after deployment.
