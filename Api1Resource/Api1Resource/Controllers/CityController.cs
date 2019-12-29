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

        public IActionResult Get()
        {
            return Ok(new List<City>
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
            });
        }
    }
}
