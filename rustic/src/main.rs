use std::ffi::OsStr;
use std::fs::{read_dir, read_to_string, File};
use std::io::Write;
use std::path::Path;

use scraper::{Html, Selector};

fn fetch_headers(files: &Vec<String>) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let mut headers = Vec::new();

    for file in files {
        let html_content = read_to_string(file)?;

        let document = Html::parse_document(&html_content);

        let h1_selector = Selector::parse("h1").unwrap();
        let h1_element = document.select(&h1_selector).next();

        // Check if an <h1> element was found and print its content
        if let Some(header) = h1_element {
            headers.push(header.text().collect::<String>());
        }
    }
    Ok(headers)
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let main_dir = "/var/www/html/blog/";
    let files = fetch_html_files(main_dir)?;
    let headers = fetch_headers(&files)?;

    let files = files
        .into_iter()
        .map(|s| {
            s.trim_start_matches(main_dir)
                .trim_end_matches("index.html")
                .to_string()
        })
        .collect();
    let data = Data { files, headers };
    write_html_content(data)?;
    Ok(())
}

fn fetch_html_files(directory_path: &str) -> Result<Vec<String>, std::io::Error> {
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
                index_files.extend(fetch_html_files(
                    &entry.path().to_string_lossy().to_string(),
                )?)
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

struct Data {
    files: Vec<String>,
    headers: Vec<String>,
}

fn write_html_content(data: Data) -> Result<(), Box<dyn std::error::Error>> {
    let mut file = File::create("/var/www/html/blog/toc/toc.html")?;

    let mut content = String::new();

    assert!(data.files.len() == data.headers.len());

    for i in 0..data.files.len() {
        content += &format!("<a href=\"{}\">{}</a>", data.files[i], data.headers[i]);
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
