use std::ffi::OsStr;
use std::fs::{read_dir, read_to_string, File};
use std::io::Write;
use std::path::Path;

use chrono::NaiveDate;
use scraper::{Html, Selector};

#[derive(Clone)]
struct Data {
    file: String,
    header: String,
    date: String,
    description: String,
    image: String,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let main_dir = "/var/www/html/blog/";
    let mut data = Vec::new();
    let files = fetch_files(main_dir)?;

    let headers = fetch_headers(&files)?;
    let dates = fetch_dates(&files)?;
    let descriptions = fetch_descriptions(&files)?;
    let images = fetch_images(&files)?;

    let files: Vec<String> = files
        .into_iter()
        .map(|s| {
            s.trim_start_matches(main_dir)
                .trim_end_matches("index.html")
                .to_string()
        })
        .collect();
    for i in 0..files.len() {
        data.push(Data {
            file: files[i].to_owned(),
            header: headers[i].to_owned(),
            date: dates[i].to_owned(),
            description: descriptions[i].to_owned(),
            image: images[i].to_owned(),
        })
    }
    data.sort_by(|a, b| b.date.cmp(&a.date));
    write_blog_toc(data.clone())?;
    if data.len() > 0 {
        write_recent_blogs(data[0..data.len().min(2)].to_vec())?;
    } else {
        println!("WARN: There are no blogs, the length is 0");
    }
    Ok(())
}

fn fetch_files(directory_path: &str) -> Result<Vec<String>, std::io::Error> {
    let dir = Path::new(directory_path);

    if !dir.is_dir() {
        return Err(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "Directory not found",
        ));
    }

    let mut index_files = Vec::new();

    for entry in read_dir(dir)? {
        if let Ok(entry) = entry {
            if entry.path().is_dir() {
                index_files.extend(fetch_files(&entry.path().to_string_lossy().to_string())?)
            }

            let path = entry.path();
            let mut components = path.components();
            components.next_back();
            let subdir_name = match components.next_back() {
                Some(name) => name.as_os_str(),
                None => OsStr::new(""),
            };

            if let Some(file_name) = entry.file_name().to_str() {
                if file_name == "index.html" && "blog" != subdir_name {
                    index_files.push(entry.path().to_string_lossy().to_string());
                }
            }
        }
    }

    Ok(index_files)
}

fn fetch_headers(files: &Vec<String>) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let mut headers = Vec::new();

    for file in files {
        let html_content = read_to_string(file)?;

        let document = Html::parse_document(&html_content);

        let h1_selector = Selector::parse("h1").unwrap();
        let h1_element = document.select(&h1_selector).next();

        let h1 = match h1_element {
            Some(header) => header.text().collect::<String>(),
            None => String::new(),
        };
        headers.push(h1);
    }
    Ok(headers)
}

fn fetch_dates(files: &Vec<String>) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let mut dates = Vec::new();

    for file in files {
        let html_content = read_to_string(file)?;

        let document = Html::parse_document(&html_content);

        let date_selector = Selector::parse("#blog-date").unwrap();
        let date_element = document.select(&date_selector).next();

        let date = match date_element {
            Some(date) => {
                let datetime = date.value().attr("datetime");

                match datetime {
                    Some(time) => time,
                    None => "ERROR: Date has no <code>datetime</code> attribute",
                }
            }
            None => "NO IMAGE YET",
        };
        dates.push(date.to_string());
    }
    Ok(dates)
}

fn fetch_descriptions(files: &Vec<String>) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let mut descriptions = Vec::new();

    for file in files {
        let html_content = read_to_string(file)?;
        let document = Html::parse_document(&html_content);

        let paragraph_selector = Selector::parse("p").unwrap();
        let paragrapth_element = document.select(&paragraph_selector).next();

        match paragrapth_element {
            Some(paragraph) => {
                descriptions.push(paragraph.text().collect::<String>());
            }
            None => descriptions.push("NO CONTENT YET".to_string()),
        }
    }
    Ok(descriptions)
}

fn fetch_images(files: &Vec<String>) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let mut images = Vec::new();

    for file in files {
        let html_content = read_to_string(file)?;
        let document = Html::parse_document(&html_content);

        let image_selector = Selector::parse("img").unwrap();
        let image_element = document.select(&image_selector).next();

        let content = match image_element {
            Some(image) => {
                let image_src = image.value().attr("src");

                match image_src {
                    Some(src) => src,
                    None => "ERROR: Image has no src attribute",
                }
            }
            None => "",
        };
        images.push(content.to_string());
    }
    Ok(images)
}

fn write_blog_toc(data: Vec<Data>) -> Result<(), Box<dyn std::error::Error>> {
    let mut file = File::create("/var/www/html/blog/toc/toc.html")?;
    let mut content = String::new();

    for d in data {
        content += &format!("<h3>{}</h3>", d.header);
        content += &format!(
            "<p class=\"blog-date\"><em>{}</em></p>",
            format_datetime(&d.date)
        );
        if !d.image.is_empty() {
            content += &format!(
                "<a href=\"{}\"><img src=\"{}\" alt=\"{}\"></a>",
                d.file, d.image, d.image
            );
        }
        content += &format!(
            "<p style=\"margin-bottom: 0;\">{} <a href=\"{}\"><em>Read more</em></a></p>",
            d.description, d.file
        );
        content += "<div style=\"height: 20px;\"></div>";
    }

    let html_content = format!(
        "
<!DOCTYPE html>
<html>
<head>
</head>
<body>

{}

</body>
</html>
",
        content
    );

    file.write_all(html_content.as_bytes())?;
    Ok(())
}

fn write_recent_blogs(data: Vec<Data>) -> Result<(), Box<dyn std::error::Error>> {
    let mut file = File::create("/var/www/html/main/recent-blogs/recent-blogs.html")?;
    let mut content = String::new();

    for d in data {
        let d = Data {
            file: format!("blog/{}", d.file),
            header: d.header,
            date: d.date,
            description: d.description,
            image: d.image,
        };

        content += &format!("<h3>{}</h3>", d.header);
        content += &format!(
            "<p class=\"blog-date\"><em>{}</em></p>",
            format_datetime(&d.date)
        );
        if !d.image.is_empty() {
            content += &format!(
                "<a href=\"{}\"><img src=\"{}\" alt=\"{}\"></a>",
                d.file, d.image, d.image
            );
        }
        content += &format!(
            "<p style=\"margin-bottom: 0;\">{} <a href=\"{}\"><em>Read more</em></a></p>",
            d.description, d.file
        );
        content += "<div style=\"height: 20px;\"></div>";
    }

    let html_content = format!(
        "
<!DOCTYPE html>
<html>
<head>
</head>
<body>

{}

</body>
</html>
",
        content
    );

    file.write_all(html_content.as_bytes())?;
    Ok(())
}

fn format_datetime(input_date: &str) -> String {
    let date = match NaiveDate::parse_from_str(input_date, "%Y-%m-%d") {
        Ok(date) => date,
        Err(err) => {
            println!("failed to parse given input datetime, {}", err);
            return "FAILED TO PARSE DATE".to_string();
        }
    };

    date.format("%B %-d, %Y").to_string()
}
