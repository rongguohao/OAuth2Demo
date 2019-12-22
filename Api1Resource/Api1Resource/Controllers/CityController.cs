using System;
using System.Collections.Generic;
using Api1Resource.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Api1Resource.Controllers
{
    [Route("api/city")]
    [Authorize]
    public class CityController: Controller
    {
        private readonly List<City> _Citys;
        private const string Key = "City_KEY";
        private readonly IMemoryCache _memoryCache;

        public CityController(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
            _Citys = new List<City>
            {
                new City
                {
                    Id = Guid.NewGuid(),
                    CityName = "北京"
                },
                new City
                {
                    Id = Guid.NewGuid(),
                    CityName = "上海"
                },
                new City
                {
                    Id = Guid.NewGuid(),
                    CityName = "深圳"
                },
                new City
                {
                    Id = Guid.NewGuid(),
                    CityName = "广州"
                }
            };

            if (!memoryCache.TryGetValue(Key, out List<City> citys))
            {
                var options = new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromDays(1));
                _memoryCache.Set(Key, citys, options);
            }
        }

        public IActionResult Get()
        {
            if (!_memoryCache.TryGetValue(Key, out List<City> citys))
            {
                citys = _Citys;
                var options = new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromDays(1));
                _memoryCache.Set(Key, citys, options);
            }

            return Ok(citys);
        }
    }
}
